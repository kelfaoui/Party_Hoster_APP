import React, { useState, useEffect, useRef } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import api from '../api/axiosConfig';
import { FaMapMarkerAlt, FaSearch, FaFilter, FaRedo } from 'react-icons/fa';

// Import Leaflet pour la carte
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Correction pour les icônes Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const Carte = () => {
  const [salles, setSalles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [map, setMap] = useState(null);
  const [markers, setMarkers] = useState([]);
  const [filteredSalles, setFilteredSalles] = useState([]);
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);

  // État pour les filtres
  const [filters, setFilters] = useState({
    localisation: '',
    prix_min: '',
    prix_max: '',
    capacite_min: '',
    rayon: 50, // Rayon en kilomètres
  });

  // Position par défaut (centre de l'Algérie)
  const [centerPosition, setCenterPosition] = useState({
    lat: 28.0339,
    lng: 1.6596,
    zoom: 6
  });

  // État pour la recherche par position
  const [searchPosition, setSearchPosition] = useState({
    lat: '',
    lng: ''
  });

  // Initialiser la carte
  useEffect(() => {
    if (!mapInstanceRef.current && mapRef.current) {
      const mapInstance = L.map(mapRef.current).setView(
        [centerPosition.lat, centerPosition.lng],
        centerPosition.zoom
      );

      // Ajouter la couche OpenStreetMap
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 19,
      }).addTo(mapInstance);

      mapInstanceRef.current = mapInstance;
      setMap(mapInstance);
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Charger les salles
  useEffect(() => {
    fetchSalles();
  }, []);

  // Mettre à jour les marqueurs quand les salles changent
  useEffect(() => {
    if (map && salles.length > 0) {
      updateMarkers();
    }
  }, [salles, map, filters]);

  const fetchSalles = async () => {
    try {
      setLoading(true);
      const response = await api.get('/salles');
      const sallesData = response.data;
      
      // Filtrer les salles sans coordonnées
      const sallesAvecCoords = sallesData.filter(salle => 
        salle.latitude && salle.longitude && 
        !isNaN(parseFloat(salle.latitude)) && 
        !isNaN(parseFloat(salle.longitude))
      );
      
      setSalles(sallesAvecCoords);
      setFilteredSalles(sallesAvecCoords);
      
      // Si aucune salle avec coordonnées, on charge quand même pour afficher le message
      if (sallesAvecCoords.length === 0) {
        setSalles(sallesData);
        setFilteredSalles(sallesData);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des salles:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateMarkers = () => {
    // Supprimer les anciens marqueurs
    markers.forEach(marker => {
      if (map && marker) {
        map.removeLayer(marker);
      }
    });

    const newMarkers = [];
    const bounds = L.latLngBounds();

    filteredSalles.forEach(salle => {
      if (salle.latitude && salle.longitude) {
        const lat = parseFloat(salle.latitude);
        const lng = parseFloat(salle.longitude);
        
        // Créer un marqueur personnalisé
        const customIcon = L.divIcon({
          html: `
            <div class="relative">
              <div class="bg-primary text-white rounded-xl p-2 shadow-lg transform -translate-x-1/2 -translate-y-1/2">
                <FaMapMarkerAlt class="text-lg" />
              </div>
              <div class="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 bg-white text-gray-800 px-3 py-2 rounded-lg shadow-lg whitespace-nowrap text-sm font-medium border border-gray-200">
                ${salle.nom}
                <div class="text-primary font-bold">${parseFloat(salle.prix_par_heure).toLocaleString()} €/h</div>
              </div>
            </div>
          `,
          className: 'custom-marker',
          iconSize: [40, 40],
          iconAnchor: [20, 40],
        });

        const marker = L.marker([lat, lng], { icon: customIcon })
          .bindPopup(`
            <div class="p-2">
              <h3 class="font-bold text-lg mb-2">${salle.nom}</h3>
              <p class="text-gray-600 mb-2">${salle.description?.substring(0, 100)}...</p>
              <p class="mb-1"><strong>Prix:</strong> ${parseFloat(salle.prix_par_heure).toLocaleString()} €/h</p>
              <p class="mb-1"><strong>Capacité:</strong> ${salle.capacite} personnes</p>
              <p class="mb-3"><strong>Localisation:</strong> ${salle.localisation}</p>
              <a href="/salles/${salle.salle_id}" class="bg-primary text-white px-4 py-2 rounded hover:bg-primary-dark transition-colors no-underline inline-block">
                Voir détails
              </a>
            </div>
          `)
          .addTo(map);

        newMarkers.push(marker);
        bounds.extend([lat, lng]);
      }
    });

    setMarkers(newMarkers);

    // Ajuster la vue pour inclure tous les marqueurs
    if (filteredSalles.length > 0 && bounds.isValid()) {
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  };

  const applyFilters = () => {
    let filtered = [...salles];

    // Filtre par localisation
    if (filters.localisation) {
      filtered = filtered.filter(salle =>
        salle.localisation?.toLowerCase().includes(filters.localisation.toLowerCase())
      );
    }

    // Filtre par prix minimum
    if (filters.prix_min) {
      filtered = filtered.filter(salle =>
        parseFloat(salle.prix_par_heure) >= parseFloat(filters.prix_min)
      );
    }

    // Filtre par prix maximum
    if (filters.prix_max) {
      filtered = filtered.filter(salle =>
        parseFloat(salle.prix_par_heure) <= parseFloat(filters.prix_max)
      );
    }

    // Filtre par capacité minimum
    if (filters.capacite_min) {
      filtered = filtered.filter(salle =>
        salle.capacite >= parseInt(filters.capacite_min)
      );
    }

    // Filtre par rayon si une position de recherche est spécifiée
    if (searchPosition.lat && searchPosition.lng) {
      const centerLat = parseFloat(searchPosition.lat);
      const centerLng = parseFloat(searchPosition.lng);
      const radius = parseFloat(filters.rayon);

      filtered = filtered.filter(salle => {
        if (!salle.latitude || !salle.longitude) return false;
        
        const salleLat = parseFloat(salle.latitude);
        const salleLng = parseFloat(salle.longitude);
        
        const distance = calculateDistance(centerLat, centerLng, salleLat, salleLng);
        return distance <= radius;
      });
    }

    setFilteredSalles(filtered);
  };

  // Calcul de distance entre deux points (formule de Haversine)
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Rayon de la Terre en km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c; // Distance en km
  };

  const handleSearchByLocation = () => {
    if (searchPosition.lat && searchPosition.lng) {
      const lat = parseFloat(searchPosition.lat);
      const lng = parseFloat(searchPosition.lng);
      
      if (!isNaN(lat) && !isNaN(lng)) {
        // Centrer la carte sur la position recherchée
        if (map) {
          map.setView([lat, lng], 12);
          
          // Ajouter un marqueur pour la position recherchée
          const searchMarker = L.marker([lat, lng])
            .addTo(map)
            .bindPopup('Position recherchée')
            .openPopup();
            
          // Ajouter un cercle pour le rayon de recherche
          L.circle([lat, lng], {
            color: 'blue',
            fillColor: '#3b82f6',
            fillOpacity: 0.1,
            radius: filters.rayon * 1000 // Convertir km en mètres
          }).addTo(map);
        }
        
        // Appliquer les filtres
        applyFilters();
      }
    }
  };

  const handleResetFilters = () => {
    setFilters({
      localisation: '',
      prix_min: '',
      prix_max: '',
      capacite_min: '',
      rayon: 50,
    });
    setSearchPosition({
      lat: '',
      lng: ''
    });
    setFilteredSalles(salles);
    
    // réinitialiserr la vue de la carte
    if (map) {
      map.setView([centerPosition.lat, centerPosition.lng], centerPosition.zoom);
    }
  };

  const handleUseCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setSearchPosition({
            lat: latitude.toString(),
            lng: longitude.toString()
          });
          
          // Optionnel: centrer automatiquement la carte
          if (map) {
            map.setView([latitude, longitude], 12);
          }
        },
        (error) => {
          console.error('Erreur de géolocalisation:', error);
          alert('Impossible d\'obtenir votre position. Veuillez entrer manuellement les coordonnées.');
        }
      );
    } else {
      alert('La géolocalisation n\'est pas supportée par votre navigateur.');
    }
  };

  useEffect(() => {
    applyFilters();
  }, [filters, searchPosition]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow px-5">
        <div className="container-custom py-8">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-2">
              Nos salles sur la carte
            </h1>
            <p className="text-gray-600">
              Localisez les salles disponibles sur la carte
            </p>
          </div>

          {/* Panneau de filtres */}
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
    {/* Recherche par coordonnées */}
    <div className="space-y-2">
      <label className="block text-gray-700 font-medium">
        Recherche par coordonnées
      </label>
      <div className="grid grid-cols-2 gap-2">
        <input
          type="number"
          step="any"
          placeholder="Latitude"
          className="px-3 py-2 border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-primary focus:border-transparent"
          value={searchPosition.lat}
          onChange={(e) => setSearchPosition({...searchPosition, lat: e.target.value})}
        />
        <input
          type="number"
          step="any"
          placeholder="Longitude"
          className="px-3 py-2 border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-primary focus:border-transparent"
          value={searchPosition.lng}
          onChange={(e) => setSearchPosition({...searchPosition, lng: e.target.value})}
        />
      </div>
      <div className="flex gap-2 mt-2">
        <button
          onClick={handleSearchByLocation}
          className="btn-primary flex-1 flex items-center justify-center py-2 text-sm"
        >
          <FaSearch className="mr-2" />
          Rechercher
        </button>
        <button
          onClick={handleUseCurrentLocation}
          className="btn-outline flex items-center justify-center py-2 px-3 text-sm"
          title="Utiliser ma position actuelle"
        >
          <FaMapMarkerAlt />
        </button>
      </div>
    </div>

    {/* Rayon de recherche */}
    <div className="space-y-2">
      <label className="block text-gray-700 font-medium">
        Rayon de recherche: {filters.rayon} km
      </label>
      <input
        type="range"
        min="1"
        max="1000"
        step="1"
        value={filters.rayon}
        onChange={(e) => setFilters({...filters, rayon: parseInt(e.target.value)})}
        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
      />
      <div className="flex justify-between text-xs text-gray-500 mt-1">
        <span>1 km</span>
        <span>100 km</span>
        <span>1000 km</span>
      </div>
    </div>

    {/* Filtres de prix */}
    <div className="space-y-2">
      <label className="block text-gray-700 font-medium">
        Prix (€/heure)
      </label>
      <div className="flex gap-2">
        <div className="flex-1">
          <input
            type="number"
            placeholder="Min"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            value={filters.prix_min}
            onChange={(e) => setFilters({...filters, prix_min: e.target.value})}
          />
        </div>
        <div className="flex-1">
          <input
            type="number"
            placeholder="Max"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            value={filters.prix_max}
            onChange={(e) => setFilters({...filters, prix_max: e.target.value})}
          />
        </div>
      </div>
    </div>

    {/* Filtres de localisation et capacité */}
    <div className="space-y-4">
      <div>
        <label className="block text-gray-700 font-medium mb-1 text-sm">
          Localisation
        </label>
        <input
          type="text"
          placeholder="Ville ou adresse"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          value={filters.localisation}
          onChange={(e) => setFilters({...filters, localisation: e.target.value})}
        />
      </div>
      <div>
        <label className="block text-gray-700 font-medium mb-1 text-sm">
          Capacité minimum
        </label>
        <input
          type="number"
          placeholder="Personnes"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          value={filters.capacite_min}
          onChange={(e) => setFilters({...filters, capacite_min: e.target.value})}
        />
      </div>
    </div>
  </div>

  {/* Bouton de réinitialisation */}
  <div className="flex justify-end pt-4 border-t border-gray-200">
    <button
      onClick={handleResetFilters}
      className="px-4 py-2 text-gray-600 hover:text-gray-800 flex items-center text-sm"
    >
      <FaRedo className="mr-2" />
      Réinitialiser tous les filtres
    </button>
  </div>
</div>

          {/* Carte et statistiques */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Carte */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div 
                  ref={mapRef} 
                  className="h-[600px] w-full"
                  style={{ minHeight: '600px' }}
                />
              </div>
            </div>

            {/* Liste des salles */}
            <div className="space-y-6">
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4">
                  Salles à proximité ({filteredSalles.length})
                </h3>
                
                {loading ? (
                  <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-xl h-8 w-8 border-b-2 border-primary"></div>
                  </div>
                ) : filteredSalles.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <FaMapMarkerAlt className="text-4xl mx-auto mb-4 text-gray-300" />
                    <p>Aucune salle trouvée dans cette zone</p>
                  </div>
                ) : (
                  <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
                    {filteredSalles.map((salle) => (
                      <div 
                        key={salle.salle_id} 
                        className="border rounded-lg p-4 hover:border-primary transition-colors cursor-pointer"
                        onClick={() => {
                          if (map && salle.latitude && salle.longitude) {
                            map.setView([parseFloat(salle.latitude), parseFloat(salle.longitude)], 15);
                          }
                        }}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-bold text-gray-800">{salle.nom}</h4>
                          <span className="bg-primary text-white px-2 py-1 rounded text-sm">
                            {parseFloat(salle.prix_par_heure).toLocaleString()} €/h
                          </span>
                        </div>
                        <p className="text-gray-600 text-sm mb-2 line-clamp-2">
                          {salle.description || 'Salle professionnelle'}
                        </p>
                        <div className="flex justify-between text-sm text-gray-500">
                          <span className="flex items-center">
                            <FaMapMarkerAlt className="mr-1" />
                            {salle.localisation || 'Non spécifié'}
                          </span>
                          <span>{salle.capacite} personnes</span>
                        </div>
                        <a 
                          href={`/salles/${salle.salle_id}`}
                          className="block text-center mt-3 btn-outline text-sm py-2"
                          onClick={(e) => e.stopPropagation()}
                        >
                          Voir détails
                        </a>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Statistiques */}
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4">
                  Statistiques
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Salles totales:</span>
                    <span className="font-semibold">{salles.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Prix moyen:</span>
                    <span className="font-semibold">
                      {filteredSalles.length > 0 
                        ? Math.round(filteredSalles.reduce((sum, s) => sum + parseFloat(s.prix_par_heure), 0) / filteredSalles.length).toLocaleString() 
                        : 0} €/h
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Capacité moyenne:</span>
                    <span className="font-semibold">
                      {filteredSalles.length > 0 
                        ? Math.round(filteredSalles.reduce((sum, s) => sum + s.capacite, 0) / filteredSalles.length) 
                        : 0} personnes
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Villes couvertes:</span>
                    <span className="font-semibold">
                      {[...new Set(filteredSalles.map(s => s.localisation?.split(',')[0]).filter(Boolean))].length}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Instructions */}
          <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h4 className="text-lg font-semibold text-blue-800 mb-2">
              Comment utiliser la carte ?
            </h4>
            <ul className="space-y-2 text-blue-700">
              <li>• Cliquez sur un marqueur pour voir les détails d'une salle</li>
              <li>• Utilisez les filtres pour affiner votre recherche</li>
              <li>• Entrez des coordonnées GPS ou utilisez votre position actuelle</li>
              <li>• Ajustez le rayon de recherche pour élargir ou réduire la zone</li>
              <li>• Cliquez sur une salle dans la liste pour la localiser sur la carte</li>
            </ul>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Carte;