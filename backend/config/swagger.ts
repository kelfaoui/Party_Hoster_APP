import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Party Hoster API',
      version: '1.0.0',
      description: 'API complète pour la gestion de réservations de salles de fête',
      contact: {
        name: 'Support Party Hoster',
        email: 'support@partyhoster.com',
        url: 'https://partyhoster.com'
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT'
      }
    },
    servers: [
      {
        url: 'http://localhost:5000/api',
        description: 'Serveur de développement'
      },
      {
        url: 'https://api.partyhoster.com/api',
        description: 'Serveur de production'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Token JWT obtenu via /api/utilisateurs/login'
        }
      },
      schemas: {
        Utilisateur: {
          type: 'object',
          required: ['email', 'mot_de_passe', 'nom', 'prenom'],
          properties: {
            utilisateur_id: {
              type: 'integer',
              description: 'ID unique de l\'utilisateur',
              example: 1
            },
            nom: {
              type: 'string',
              description: 'Nom de l\'utilisateur',
              example: 'Dupont'
            },
            prenom: {
              type: 'string',
              description: 'Prénom de l\'utilisateur',
              example: 'Jean'
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'Email de l\'utilisateur',
              example: 'jean.dupont@email.com'
            },
            numero_telephone: {
              type: 'string',
              description: 'Numéro de téléphone',
              example: '+33612345678'
            },
            image: {
              type: 'string',
              description: 'URL de l\'image de profil',
              example: 'http://localhost:5000/uploads/profiles/user1.jpg'
            },
            type: {
              type: 'string',
              enum: ['Client', 'Proprietaire', 'Administrateur'],
              description: 'Type d\'utilisateur',
              example: 'Client'
            },
            actif: {
              type: 'boolean',
              description: 'Statut d\'activation du compte',
              example: true
            }
          }
        },
        Salle: {
          type: 'object',
          required: ['nom', 'localisation', 'capacite', 'prix_par_heure'],
          properties: {
            salle_id: {
              type: 'integer',
              description: 'ID unique de la salle',
              example: 1
            },
            nom: {
              type: 'string',
              description: 'Nom de la salle',
              example: 'Salle de fête Étoile'
            },
            description: {
              type: 'string',
              description: 'Description de la salle',
              example: 'Grande salle lumineuse parfaite pour les événements'
            },
            localisation: {
              type: 'string',
              description: 'Adresse de la salle',
              example: '123 Avenue des Champs-Élysées, Paris'
            },
            capacite: {
              type: 'integer',
              description: 'Capacité d\'accueil de la salle',
              example: 150
            },
            prix_par_heure: {
              type: 'number',
              description: 'Prix par heure de location',
              example: 150.50
            },
            longitude: {
              type: 'number',
              description: 'Longitude de la salle',
              example: 2.2945
            },
            latitude: {
              type: 'number',
              description: 'Latitude de la salle',
              example: 48.8584
            },
            equipements: {
              type: 'string',
              description: 'Équipements disponibles',
              example: 'Son, lumière, projecteur, tables, chaises'
            },
            disponibilite: {
              type: 'boolean',
              description: 'Disponibilité de la salle',
              example: true
            },
            image: {
              type: 'string',
              description: 'URL de l\'image de la salle',
              example: 'http://localhost:5000/uploads/salles/salle1.jpg'
            },
            utilisateur_id: {
              type: 'integer',
              description: 'ID du propriétaire de la salle',
              example: 2
            },
            utilisateur_nom: {
              type: 'string',
              description: 'Nom du propriétaire',
              example: 'Martin'
            },
            utilisateur_prenom: {
              type: 'string',
              description: 'Prénom du propriétaire',
              example: 'Sophie'
            }
          }
        },
        Reservation: {
          type: 'object',
          required: ['salle_id', 'utilisateur_id', 'heure_debut', 'heure_fin'],
          properties: {
            reservation_id: {
              type: 'integer',
              description: 'ID unique de la réservation',
              example: 1
            },
            salle_id: {
              type: 'integer',
              description: 'ID de la salle réservée',
              example: 1
            },
            utilisateur_id: {
              type: 'integer',
              description: 'ID de l\'utilisateur qui réserve',
              example: 3
            },
            heure_debut: {
              type: 'string',
              format: 'date-time',
              description: 'Date et heure de début de réservation',
              example: '2024-12-31T20:00:00.000Z'
            },
            heure_fin: {
              type: 'string',
              format: 'date-time',
              description: 'Date et heure de fin de réservation',
              example: '2024-12-31T23:00:00.000Z'
            },
            statut: {
              type: 'string',
              enum: ['EnAttente', 'Confirmee', 'Annulee'],
              description: 'Statut de la réservation',
              example: 'Confirmee'
            },
            prix_total: {
              type: 'number',
              description: 'Prix total de la réservation',
              example: 451.50
            },
            date_creation: {
              type: 'string',
              format: 'date-time',
              description: 'Date de création de la réservation',
              example: '2024-12-01T10:30:00.000Z'
            },
            salle_nom: {
              type: 'string',
              description: 'Nom de la salle',
              example: 'Salle de fête Étoile'
            },
            utilisateur_nom: {
              type: 'string',
              description: 'Nom de l\'utilisateur',
              example: 'Durand'
            },
            utilisateur_prenom: {
              type: 'string',
              description: 'Prénom de l\'utilisateur',
              example: 'Marie'
            }
          }
        },
        Notation: {
          type: 'object',
          required: ['salle_id', 'utilisateur_id', 'note'],
          properties: {
            notation_id: {
              type: 'integer',
              description: 'ID unique de la notation',
              example: 1
            },
            salle_id: {
              type: 'integer',
              description: 'ID de la salle notée',
              example: 1
            },
            utilisateur_id: {
              type: 'integer',
              description: 'ID de l\'utilisateur qui note',
              example: 3
            },
            note: {
              type: 'integer',
              minimum: 1,
              maximum: 5,
              description: 'Note de 1 à 5',
              example: 5
            },
            date_creation: {
              type: 'string',
              format: 'date-time',
              description: 'Date de création de la notation',
              example: '2024-12-01T14:20:00.000Z'
            },
            utilisateur_nom: {
              type: 'string',
              description: 'Nom de l\'utilisateur qui a noté',
              example: 'Durand'
            },
            utilisateur_prenom: {
              type: 'string',
              description: 'Prénom de l\'utilisateur qui a noté',
              example: 'Marie'
            },
            salle_nom: {
              type: 'string',
              description: 'Nom de la salle notée',
              example: 'Salle de fête Étoile'
            }
          }
        },
        Commentaire: {
          type: 'object',
          required: ['salle_id', 'utilisateur_id', 'commentaire'],
          properties: {
            commentaire_id: {
              type: 'integer',
              description: 'ID unique du commentaire',
              example: 1
            },
            salle_id: {
              type: 'integer',
              description: 'ID de la salle commentée',
              example: 1
            },
            utilisateur_id: {
              type: 'integer',
              description: 'ID de l\'utilisateur qui commente',
              example: 3
            },
            commentaire: {
              type: 'string',
              description: 'Contenu du commentaire',
              example: 'Salle magnifique, très bien équipée et le personnel est très professionnel. Je recommande vivement !'
            },
            date_creation: {
              type: 'string',
              format: 'date-time',
              description: 'Date de création du commentaire',
              example: '2024-12-01T14:25:00.000Z'
            },
            utilisateur_nom: {
              type: 'string',
              description: 'Nom de l\'utilisateur qui a commenté',
              example: 'Durand'
            },
            utilisateur_prenom: {
              type: 'string',
              description: 'Prénom de l\'utilisateur qui a commenté',
              example: 'Marie'
            },
            salle_nom: {
              type: 'string',
              description: 'Nom de la salle commentée',
              example: 'Salle de fête Étoile'
            }
          }
        },
        Error: {
          type: 'object',
          required: ['message'],
          properties: {
            message: {
              type: 'string',
              description: 'Message d\'erreur détaillé',
              example: 'Utilisateur non trouvé'
            },
            error: {
              type: 'string',
              description: 'Type d\'erreur',
              example: 'NOT_FOUND'
            },
            details: {
              type: 'object',
              description: 'Détails supplémentaires sur l\'erreur',
              example: {
                field: 'email',
                value: 'invalid@email'
              }
            }
          }
        },
        SuccessResponse: {
          type: 'object',
          properties: {
            message: {
              type: 'string',
              description: 'Message de succès',
              example: 'Opération réalisée avec succès'
            },
            data: {
              type: 'object',
              description: 'Données retournées'
            }
          }
        },
        PaginatedResponse: {
          type: 'object',
          properties: {
            data: {
              type: 'array',
              items: {
                type: 'object'
              },
              description: 'Liste des résultats'
            },
            pagination: {
              type: 'object',
              properties: {
                total: {
                  type: 'integer',
                  description: 'Nombre total d\'éléments',
                  example: 150
                },
                limit: {
                  type: 'integer',
                  description: 'Nombre d\'éléments par page',
                  example: 10
                },
                offset: {
                  type: 'integer',
                  description: 'Nombre d\'éléments sautés',
                  example: 0
                },
                page: {
                  type: 'integer',
                  description: 'Numéro de page actuelle',
                  example: 1
                }
              }
            }
          }
        }
      }
    },
    security: [
      {
        bearerAuth: []
      }
    ]
  },
  apis: ['./routes/*.ts'],
};

const specs = swaggerJsdoc(options);

export { specs, swaggerUi };
