import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API Réservations de Salles',
      version: '1.0.0',
      description: 'API de gestion de réservations de salles',
      contact: {
        name: 'Support',
        email: 'support@partyhoster.com'
      }
    },
    servers: [
      {
        url: 'http://localhost:5000',
        description: 'Serveur de développement'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      },
      schemas: {
        Utilisateur: {
          type: 'object',
          required: ['nom', 'email', 'mot_de_passe'],
          properties: {
            id: {
              type: 'integer',
              description: 'ID unique de l\'utilisateur'
            },
            nom: {
              type: 'string',
              description: 'Nom de l\'utilisateur'
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'Email de l\'utilisateur'
            },
            mot_de_passe: {
              type: 'string',
              description: 'Mot de passe de l\'utilisateur'
            },
            role: {
              type: 'string',
              enum: ['utilisateur', 'admin'],
              description: 'Rôle de l\'utilisateur'
            },
            actif: {
              type: 'boolean',
              description: 'Statut d\'activation du compte'
            }
          }
        },
        Salle: {
          type: 'object',
          required: ['nom', 'adresse', 'capacite', 'prix_par_heure'],
          properties: {
            id: {
              type: 'integer',
              description: 'ID unique de la salle'
            },
            nom: {
              type: 'string',
              description: 'Nom de la salle'
            },
            description: {
              type: 'string',
              description: 'Description de la salle'
            },
            adresse: {
              type: 'string',
              description: 'Adresse de la salle'
            },
            capacite: {
              type: 'integer',
              description: 'Capacité d\'accueil de la salle'
            },
            prix_par_heure: {
              type: 'number',
              description: 'Prix par heure de location'
            },
            image_url: {
              type: 'string',
              description: 'URL de l\'image de la salle'
            },
            proprietaire_id: {
              type: 'integer',
              description: 'ID du propriétaire de la salle'
            }
          }
        },
        Reservation: {
          type: 'object',
          required: ['salle_id', 'utilisateur_id', 'date_debut', 'date_fin'],
          properties: {
            id: {
              type: 'integer',
              description: 'ID unique de la réservation'
            },
            salle_id: {
              type: 'integer',
              description: 'ID de la salle réservée'
            },
            utilisateur_id: {
              type: 'integer',
              description: 'ID de l\'utilisateur qui réserve'
            },
            date_debut: {
              type: 'string',
              format: 'date-time',
              description: 'Date et heure de début de réservation'
            },
            date_fin: {
              type: 'string',
              format: 'date-time',
              description: 'Date et heure de fin de réservation'
            },
            statut: {
              type: 'string',
              enum: ['en_attente', 'confirmee', 'annulee'],
              description: 'Statut de la réservation'
            },
            prix_total: {
              type: 'number',
              description: 'Prix total de la réservation'
            }
          }
        },
        Notation: {
          type: 'object',
          required: ['salle_id', 'utilisateur_id', 'note'],
          properties: {
            id: {
              type: 'integer',
              description: 'ID unique de la notation'
            },
            salle_id: {
              type: 'integer',
              description: 'ID de la salle notée'
            },
            utilisateur_id: {
              type: 'integer',
              description: 'ID de l\'utilisateur qui note'
            },
            note: {
              type: 'integer',
              minimum: 1,
              maximum: 5,
              description: 'Note de 1 à 5'
            }
          }
        },
        Commentaire: {
          type: 'object',
          required: ['salle_id', 'utilisateur_id', 'contenu'],
          properties: {
            id: {
              type: 'integer',
              description: 'ID unique du commentaire'
            },
            salle_id: {
              type: 'integer',
              description: 'ID de la salle commentée'
            },
            utilisateur_id: {
              type: 'integer',
              description: 'ID de l\'utilisateur qui commente'
            },
            contenu: {
              type: 'string',
              description: 'Contenu du commentaire'
            },
            date_creation: {
              type: 'string',
              format: 'date-time',
              description: 'Date de création du commentaire'
            }
          }
        },
        Error: {
          type: 'object',
          properties: {
            message: {
              type: 'string',
              description: 'Message d\'erreur'
            },
            stack: {
              type: 'string',
              description: 'Stack trace (en développement seulement)'
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
  apis: ['./routes/*.ts', './controllers/*.ts']
};

const specs = swaggerJsdoc(options);

export { specs, swaggerUi };
