-- phpMyAdmin SQL Dump
-- version 5.1.1
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1:3306
-- Généré le : lun. 09 fév. 2026 à 21:39
-- Version du serveur : 5.7.36
-- Version de PHP : 8.0.13

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `reservations_salles`
--

-- --------------------------------------------------------

--
-- Structure de la table `commentaires`
--

DROP TABLE IF EXISTS `commentaires`;
CREATE TABLE IF NOT EXISTS `commentaires` (
  `commentaire_id` int(11) NOT NULL AUTO_INCREMENT,
  `utilisateur_id` int(11) NOT NULL,
  `salle_id` int(11) NOT NULL,
  `commentaire` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `date_creation` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`commentaire_id`) USING BTREE,
  KEY `utilisateur_id` (`utilisateur_id`) USING BTREE,
  KEY `salle_id` (`salle_id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=26 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `commentaires`
--

INSERT INTO `commentaires` (`commentaire_id`, `utilisateur_id`, `salle_id`, `commentaire`, `date_creation`) VALUES
(1, 1, 1, 'Excellente salle, très bien équipée et personnel très professionnel. Je recommande vivement!', '2026-02-06 09:05:00'),
(2, 3, 1, 'Bon rapport qualité-prix, emplacement idéal en centre-ville. Parking un peu limité.', '2026-02-06 10:35:00'),
(3, 5, 2, 'La vue sur la mer est magnifique, espace très agréable pour travailler. Wi-Fi très rapide.', '2026-02-08 13:50:00'),
(4, 7, 2, 'Salle fonctionnelle mais le prix est un peu élevé pour Oran. Service correct.', '2026-02-08 15:25:00'),
(5, 9, 3, 'Parfaite pour nos sessions de formation. Équipements modernes et espace bien organisé.', '2026-02-08 18:20:00'),
(25, 21, 1, 'salle top', '2026-02-09 21:24:51');

-- --------------------------------------------------------

--
-- Structure de la table `notations`
--

DROP TABLE IF EXISTS `notations`;
CREATE TABLE IF NOT EXISTS `notations` (
  `notation_id` int(11) NOT NULL AUTO_INCREMENT,
  `utilisateur_id` int(11) NOT NULL,
  `salle_id` int(11) NOT NULL,
  `note` int(11) DEFAULT NULL,
  `date_creation` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`notation_id`) USING BTREE,
  KEY `utilisateur_id` (`utilisateur_id`) USING BTREE,
  KEY `salle_id` (`salle_id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=27 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `notations`
--

INSERT INTO `notations` (`notation_id`, `utilisateur_id`, `salle_id`, `note`, `date_creation`) VALUES
(1, 1, 1, 5, '2026-02-07 09:00:00'),
(2, 3, 1, 4, '2026-02-07 10:30:00'),
(3, 5, 2, 5, '2026-02-07 13:45:00'),
(4, 7, 2, 3, '2026-02-06 15:20:00'),
(26, 21, 1, 3, '2026-02-09 21:23:36');

-- --------------------------------------------------------

--
-- Structure de la table `reservations`
--

DROP TABLE IF EXISTS `reservations`;
CREATE TABLE IF NOT EXISTS `reservations` (
  `reservation_id` int(11) NOT NULL AUTO_INCREMENT,
  `utilisateur_id` int(11) NOT NULL,
  `salle_id` int(11) NOT NULL,
  `heure_debut` datetime NOT NULL,
  `heure_fin` datetime NOT NULL,
  `prix_total` decimal(10,2) NOT NULL,
  `statut` enum('EnAttente','Confirme','Annule') COLLATE utf8mb4_unicode_ci DEFAULT 'EnAttente',
  `date_creation` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`reservation_id`) USING BTREE,
  KEY `utilisateur_id` (`utilisateur_id`) USING BTREE,
  KEY `salle_id` (`salle_id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=53 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `reservations`
--

INSERT INTO `reservations` (`reservation_id`, `utilisateur_id`, `salle_id`, `heure_debut`, `heure_fin`, `prix_total`, `statut`, `date_creation`) VALUES
(37, 21, 1, '2026-02-10 07:45:00', '2026-02-10 08:45:00', '2500.00', 'EnAttente', '2026-02-09 06:45:42'),
(38, 21, 1, '2026-02-10 07:45:00', '2026-02-10 08:45:00', '2500.00', 'EnAttente', '2026-02-09 06:45:52'),
(39, 21, 1, '2026-02-10 07:45:00', '2026-02-10 08:45:00', '2500.00', 'EnAttente', '2026-02-09 06:45:54'),
(41, 21, 1, '2026-02-10 07:45:00', '2026-02-10 08:45:00', '2500.00', 'EnAttente', '2026-02-09 06:49:40'),
(42, 21, 1, '2026-02-10 07:45:00', '2026-02-10 08:45:00', '2500.00', 'EnAttente', '2026-02-09 06:49:48'),
(43, 21, 1, '2026-02-10 07:45:00', '2026-02-10 08:45:00', '2500.00', 'EnAttente', '2026-02-09 06:51:22'),
(44, 21, 1, '2026-02-10 07:45:00', '2026-02-10 08:45:00', '2500.00', 'EnAttente', '2026-02-09 06:51:30'),
(45, 21, 1, '2026-02-10 07:45:00', '2026-02-10 08:45:00', '2500.00', 'EnAttente', '2026-02-09 06:53:32'),
(46, 21, 1, '2026-02-10 07:45:00', '2026-02-10 08:45:00', '2500.00', 'EnAttente', '2026-02-09 06:53:41'),
(47, 21, 1, '2026-02-10 07:45:00', '2026-02-10 08:45:00', '2500.00', 'EnAttente', '2026-02-09 06:53:51'),
(48, 21, 1, '2026-02-11 07:57:00', '2026-02-11 10:57:00', '7500.00', 'EnAttente', '2026-02-09 06:58:43'),
(49, 21, 1, '2026-02-11 10:57:00', '2026-02-11 13:59:00', '7583.33', 'EnAttente', '2026-02-09 07:00:21'),
(50, 7, 2, '2026-02-10 12:04:00', '2026-02-10 13:07:00', '1890.00', 'EnAttente', '2026-02-09 07:05:15'),
(51, 21, 1, '2026-02-11 14:23:00', '2026-02-11 15:23:00', '20.00', 'EnAttente', '2026-02-09 07:24:16'),
(52, 21, 1, '2026-02-10 21:47:00', '2026-02-10 22:47:00', '20.00', 'EnAttente', '2026-02-09 20:47:45');

-- --------------------------------------------------------

--
-- Structure de la table `salles`
--

DROP TABLE IF EXISTS `salles`;
CREATE TABLE IF NOT EXISTS `salles` (
  `salle_id` int(11) NOT NULL AUTO_INCREMENT,
  `nom` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `utilisateur_id` int(11) NOT NULL DEFAULT '0',
  `image` varchar(400) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `capacite` int(11) NOT NULL,
  `prix_par_heure` decimal(10,2) NOT NULL,
  `localisation` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `longitude` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `latitude` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `equipements` text COLLATE utf8mb4_unicode_ci,
  `date_creation` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`salle_id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `salles`
--

INSERT INTO `salles` (`salle_id`, `nom`, `utilisateur_id`, `image`, `description`, `capacite`, `prix_par_heure`, `localisation`, `longitude`, `latitude`, `equipements`, `date_creation`) VALUES
(1, 'Salle de Conférence Elite', 2, '/uploads/salles/salle1.jpg', 'Salle moderne équipée pour les conférences professionnelles, située en plein cœur d\'Alger. Idéale pour les réunions d\'affaires et formations.', 50, '20.00', 'Avenue des Champs-Élysées, Paris 8e, Paris', '2.3071', '48.8686', 'Projecteur, Wi-Fi, Tableau blanc, Système audio, Climatisation', '2026-02-07 08:00:00'),
(2, 'Espace Réunion Business', 4, '/uploads/salles/salle2.jpg', 'Espace professionnel spacieux avec vue sur la mer, parfait pour les réunions stratégiques et présentations clients.', 30, '18.00', 'Vieux Port, Marseille, Provence-Alpes-Côte d\\\'Azur', '5.3698', '43.2965', 'Écran tactile, Wi-Fi haute vitesse, Table ronde, Climatisation', '2026-02-07 10:30:00'),
(3, 'Salle Formation', 2, '/uploads/salles/salle3.jpg', 'Salle de formation équipée pour les séminaires et workshops, située près de l\'université.', 40, '15.00', 'La Défense, Courbevoie, Île-de-France', '2.2399', '48.8924', 'Tables modulables, Projecteur 4K, Micros, Tableau interactif', '2026-02-07 13:45:00'),
(4, 'Boardroom Executive', 8, '/uploads/salles/salle4.jpg', 'Salle de conseil d\'administration haut de gamme avec mobilier design et technologie avancée.', 20, '12.00', 'Place Bellecour, Lyon, Auvergne-Rhône-Alpes', '4.8288', '45.7578', 'Écran 4K, Système vidéoconférence, Table en bois précieux', '2026-02-07 09:15:00'),
(5, 'Salle Polyvalente', 4, '/uploads/salles/salle5.jpg', 'Espace polyvalent adapté pour les événements corporatifs, lancements produits et réunions d\'équipe.', 100, '28.00', 'Place du Capitole, Toulouse, Occitanie', '1.4442', '43.6045', 'Scène, Éclairage professionnel, Sonorisation, Espace cocktail', '2026-02-07 15:20:00'),
(6, 'Creative Space', 8, '/uploads/salles/salle6.jpg', 'Espace créatif inspirant pour les brainstormings et ateliers innovants.', 25, '14.00', 'Quartier du Vieux Lille, Lille, Hauts-de-France', '3.0632', '50.6366', 'Tableaux muraux, Mobilier design, Espace détente, Kitchenette', '2026-02-07 12:10:00'),
(7, 'Meeting Room', 10, '/uploads/salles/salle7.jpg', 'Salle de réunion intime pour les réunions confidentielles et entretiens.', 12, '48.00', 'Place Stanislas, Nancy, Grand Est', '6.1844', '48.6921', 'Table ovale, Fauteuils confortables, Climatisation silencieuse', '2026-02-07 08:45:00'),
(8, 'Salle Événement', 2, '/uploads/salles/salle8.jpg', 'Grande salle événementielle avec terrasse panoramique sur la mer.', 200, '60.00', 'Promenade des Anglais, Nice, Provence-Alpes-Côte d\\\'Azur', '7.2620', '43.6951', 'Scène modulable, Éclairage LED, Bar, Terrasse', '2026-02-07 14:30:00'),
(9, 'Training Center', 4, '/uploads/salles/salle9.jpg', 'Centre de formation équipé pour les sessions longues et intensives.', 60, '20.00', 'Montparnasse, Paris 14e, Île-de-France', '2.3234', '48.8401', '30 postes informatiques, Projecteur, Serveur dédié', '2026-02-07 10:00:00'),
(10, 'Salle VIP La Centrale', 8, '/uploads/salles/salle10.jpg', 'Salle VIP avec vue sur le port, service de restauration inclus.', 15, '50.00', 'Vieux Port, Bordeaux, Nouvelle-Aquitaine', '-0.5723', '44.8426', 'Service de restauration, Bar privé, Conciergerie, Parking privé', '2026-02-07 16:00:00'),
(16, 'Salle idle Paris', 10, '/uploads/salles/salle-1766446224893-656181844.jpg', 'Description de la salle', 50, '11.00', 'Le Marais, Paris 3e, Île-de-France', '2.3590', '48.8589', 'Retro-projecteur', '2026-02-06 23:30:25');

-- --------------------------------------------------------

--
-- Structure de la table `utilisateurs`
--

DROP TABLE IF EXISTS `utilisateurs`;
CREATE TABLE IF NOT EXISTS `utilisateurs` (
  `utilisateur_id` int(11) NOT NULL AUTO_INCREMENT,
  `nom` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `image` varchar(400) COLLATE utf8mb4_unicode_ci NOT NULL,
  `prenom` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `mot_de_passe_hash` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `numero_telephone` varchar(15) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `type` enum('Client','Proprietaire','Administrateur') COLLATE utf8mb4_unicode_ci DEFAULT 'Client',
  `statut` enum('Actif','Inactif') COLLATE utf8mb4_unicode_ci DEFAULT 'Actif',
  `actif` tinyint(4) DEFAULT '1',
  `date_creation` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`utilisateur_id`) USING BTREE,
  UNIQUE KEY `email` (`email`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=25 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `utilisateurs`
--

INSERT INTO `utilisateurs` (`utilisateur_id`, `nom`, `image`, `prenom`, `email`, `mot_de_passe_hash`, `numero_telephone`, `type`, `statut`, `actif`, `date_creation`) VALUES
(1, 'Martin', 'user1.jpg', 'Jacques', 'ahmed.benali@email.com', '$2a$10$iT.sHSTelYwrWo4l53kBV.8TCituCoa8IFKN.VucTGYiTr6bQsQi.', '0555123456', 'Client', 'Actif', 0, '2026-02-04 09:30:00'),
(3, 'Dubon', 'user3.jpg', 'Michel', 'dubon@email.com', '$2a$10$iT.sHSTelYwrWo4l53kBV.8TCituCoa8IFKN.VucTGYiTr6bQsQi.', '0557345678', 'Client', 'Actif', 1, '2026-02-05 13:20:00'),
(4, 'Verdun', 'user4.jpg', 'Nadia', 'verdun@email.com', '$2a$10$iT.sHSTelYwrWo4l53kBV.8TCituCoa8IFKN.VucTGYiTr6bQsQi.', '0558456789', 'Proprietaire', 'Actif', 1, '2026-02-05 13:15:00'),
(5, 'Ferhat', 'user5.jpg', 'Youssef', 'youssef.ferhat@email.com', '$2a$10$iT.sHSTelYwrWo4l53kBV.8TCituCoa8IFKN.VucTGYiTr6bQsQi.', '0559567890', 'Client', 'Actif', 1, '2026-02-06 15:40:00'),
(6, 'Kelfaoui', 'user6.jpg', 'Chabane', 'kelfaoui@email.com', '$2a$10$iT.sHSTelYwrWo4l53kBV.8TCituCoa8IFKN.VucTGYiTr6bQsQi.', '0560678901', 'Administrateur', 'Actif', 1, '2026-02-06 16:25:00'),
(7, 'Hamoud', 'user7.jpg', 'Samir', 'samir.hamoud@email.com', '$2a$10$iT.sHSTelYwrWo4l53kBV.8TCituCoa8IFKN.VucTGYiTr6bQsQi.', '0561789012', 'Client', 'Actif', 1, '2026-02-07 07:50:00'),
(9, 'Meursault', 'user9.jpg', 'Omar', 'meursault@email.com', '$2a$10$iT.sHSTelYwrWo4l53kBV.8TCituCoa8IFKN.VucTGYiTr6bQsQi.', '0563901234', 'Client', 'Actif', 1, '2026-02-07 17:05:00'),
(19, 'Charleroi', 'default.jpg', 'Malik', 'charleroi@gmail.com', '$2a$10$iT.sHSTelYwrWo4l53kBV.8TCituCoa8IFKN.VucTGYiTr6bQsQi.', '123456789', 'Client', 'Actif', 1, '2026-02-08 07:32:36'),
(21, 'fekhar', 'default.jpg', 'oussama', 'oussamaHadjFekhar@gmail.com', '$2a$10$JlvqjwGQg1ITJbHUUZGhpuxdagdSNszCnrJtNP5DYZ7uoGjYy37cS', '0755557543', 'Client', 'Actif', 1, '2026-02-08 14:31:52'),
(22, 'demoulin', 'default.jpg', 'gabriel', 'gabriel@email.com', '$2a$10$rgqPzMVRtgjxlVWVBGyQaOfvJWuzqQAhVJXQx30VRH.FHtUDuv4ue', '0874464367', 'Proprietaire', 'Actif', 1, '2026-02-09 16:00:33'),
(23, 'Dupont', 'default.jpg', 'Jean', 'jean.dupont@email.com', '$2a$10$z8elCG6mHPQLLcsV4vbSfO6DANej6IguEeV2wIX/ypeDLh2ot.IEO', NULL, 'Client', 'Actif', 1, '2026-02-09 17:50:39'),
(24, 'kelfaoui', 'default.jpg', 'chabane', 'chbane_kelfaoui@email.com', '$2a$10$GPbGgIdzsI8g/cczjND/3OnatS1ev8fXwMiaYIDwD79mRmJ1tQ0CK', NULL, 'Client', 'Actif', 1, '2026-02-09 17:52:38');

--
-- Contraintes pour les tables déchargées
--

--
-- Contraintes pour la table `commentaires`
--
ALTER TABLE `commentaires`
  ADD CONSTRAINT `commentaires_ibfk_1` FOREIGN KEY (`utilisateur_id`) REFERENCES `utilisateurs` (`utilisateur_id`),
  ADD CONSTRAINT `commentaires_ibfk_2` FOREIGN KEY (`salle_id`) REFERENCES `salles` (`salle_id`);

--
-- Contraintes pour la table `notations`
--
ALTER TABLE `notations`
  ADD CONSTRAINT `notations_ibfk_1` FOREIGN KEY (`utilisateur_id`) REFERENCES `utilisateurs` (`utilisateur_id`),
  ADD CONSTRAINT `notations_ibfk_2` FOREIGN KEY (`salle_id`) REFERENCES `salles` (`salle_id`);

--
-- Contraintes pour la table `reservations`
--
ALTER TABLE `reservations`
  ADD CONSTRAINT `reservations_ibfk_1` FOREIGN KEY (`utilisateur_id`) REFERENCES `utilisateurs` (`utilisateur_id`),
  ADD CONSTRAINT `reservations_ibfk_2` FOREIGN KEY (`salle_id`) REFERENCES `salles` (`salle_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
