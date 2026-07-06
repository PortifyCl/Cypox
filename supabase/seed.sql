-- RADSEA Seed Data — 40 prospects
-- Paste this into Supabase SQL Editor AFTER running schema.sql

DO $$
DECLARE
  i INT;
  noms TEXT[] := ARRAY[
    'Cabinet Dr. Martin','Boulangerie Pain Doré','Garage Auto Plus','Cabinet Dentaire Sorbonne',
    'Restaurant Le Bistrot','Pharmacie Centrale','Agence Immobilière BelVilla','Salon Coiffure Élégance',
    'Menuiserie Bois & Co','Cabinet Vétérinaire','Pizzeria Napoli','Hotel Le Petit Paris',
    'Avocat & Associés','Architecte Studio','Fleuriste Jardin Magique','Librairie Les Pages',
    'Coach Bien-Être','Comptabilité Plus','Jardinage Vert Présent','Traiteur Saveurs',
    'Photographe Studio','Consultant Digital','Courtier AssurPro','École de Musique',
    'Gym Fitness Plus','Imprimerie Rapide','Jeu Vidéo Studio','Kinesithérapie Active',
    'Laboratoire Analyse','Médecine Douce','Nettoyage Pro','Opticien Vue Claire',
    'Peinture Déco','Quincaillerie Bricol','Restaurant Asiatique','Salle de Sport',
    'Taxi Express','Union Commerçants','Vétérinaire Animalie','Wedding Planner'
  ];
  secteurs TEXT[] := ARRAY['Bâtiment','Médical','Restaurant','Hôtel','Immobilier','Profession libérale','Commerce','Services'];
  villes TEXT[] := ARRAY['Paris','Lyon','Marseille','Bruxelles','Genève','Bordeaux','Nantes','Lille','Strasbourg','Toulouse'];
  statuts TEXT[] := ARRAY['Nouveau','En analyse','Analysé','Proposition préparée','En attente validation','Contacté','Relance','Converti','Rejeté'];
  sources TEXT[] := ARRAY['Google Maps','Pages Jaunes','LinkedIn','Annuaire','Réseaux sociaux'];
  designs TEXT[] := ARRAY['Obsolète','Basique','Correct','Moderne'];
  coherences TEXT[] := ARRAY['Faible','Moyen','Bon'];
  qualites TEXT[] := ARRAY['Faible','Moyen','Bon'];
  identites TEXT[] := ARRAY['Absente','Incohérente','Correcte','Professionnelle'];
  ctas TEXT[] := ARRAY['Aucun','Faible','Correct','Bon'];
  prenoms TEXT[] := ARRAY['Jean','Marie','Pierre','Sophie','Lucas','Emma','Antoine','Julie','Nicolas','Camille'];
  nom TEXT;
  secteur TEXT;
  ville TEXT;
  statut TEXT;
  score_val INT;
  has_site BOOLEAN;
  telephone TEXT;
  email_val TEXT;
  site_web_val TEXT;
  detail JSONB;
BEGIN
  FOR i IN 1..40 LOOP
    nom := noms[i];
    secteur := secteurs[((i - 1) % array_length(secteurs, 1)) + 1];
    ville := villes[((i - 1) % array_length(villes, 1)) + 1];
    statut := statuts[((i - 1) % array_length(statuts, 1)) + 1];
    score_val := 15 + ((i * 7 + 13) % 84);
    has_site := (i % 3 != 0);

    telephone := '+33 ' || (1 + (i % 6))::text || ' ' || (10 + (i % 90))::text || ' ' || (10 + ((i*3) % 90))::text || ' ' || (10 + ((i*7) % 90))::text || ' ' || (10 + ((i*11) % 90))::text;
    email_val := 'contact@' || lower(replace(nom, ' ', '')) || '.fr';
    site_web_val := CASE WHEN has_site THEN 'https://' || lower(replace(nom, ' ', '')) || '.fr' ELSE null END;

    detail := jsonb_build_object(
      'detection', jsonb_build_object(
        'secteur', secteur,
        'ville', ville,
        'source', sources[((i - 1) % array_length(sources, 1)) + 1]
      ),
      'collecte', jsonb_build_object(
        'nom', nom,
        'activite', secteur,
        'localisation', ville,
        'siteWeb', CASE WHEN has_site THEN 'https://' || lower(replace(nom, ' ', '')) || '.fr' ELSE 'Aucun' END,
        'ficheGoogle', (i % 2 = 0),
        'telephone', telephone,
        'email', CASE WHEN (i % 2 = 0) THEN email_val ELSE null END,
        'reseaux', CASE WHEN (i % 3 = 0) THEN '["Facebook"]'::jsonb WHEN (i % 3 = 1) THEN '["LinkedIn"]'::jsonb ELSE '["Facebook","Instagram"]'::jsonb END
      ),
      'analyse', jsonb_build_object(
        'siteWeb', CASE WHEN has_site THEN jsonb_build_object(
          'vitesse', 20 + ((i * 13) % 70),
          'design', designs[((i - 1) % array_length(designs, 1)) + 1],
          'responsive', (i % 3 != 0),
          'seo', 10 + ((i * 11) % 70),
          'accessibilite', 15 + ((i * 9) % 55),
          'cta', ctas[((i - 1) % array_length(ctas, 1)) + 1],
          'formulaires', (i % 2 = 0)
        ) ELSE null END,
        'referencement', jsonb_build_object(
          'visibiliteLocale', 5 + ((i * 7) % 55),
          'ficheGoogle', (i % 3 != 0),
          'coherence', coherences[((i - 1) % array_length(coherences, 1)) + 1]
        ),
        'image', jsonb_build_object(
          'qualiteVisuels', qualites[((i - 1) % array_length(qualites, 1)) + 1],
          'temoignages', (i % 3 = 0),
          'identiteGraphique', identites[((i - 1) % array_length(identites, 1)) + 1]
        )
      ),
      'opportunites', CASE
        WHEN NOT has_site THEN '["Aucun site internet","Faible référencement local"]'::jsonb
        WHEN score_val > 70 THEN '["Site obsolète nécessitant une refonte","Formulaire de contact absent","Faible référencement local"]'::jsonb
        ELSE '["Faible référencement local","Site lent"]'::jsonb
      END,
      'score', jsonb_build_object(
        'total', score_val,
        'potentiel', CASE WHEN score_val > 70 THEN 'Élevé' WHEN score_val > 40 THEN 'Moyen' ELSE 'Faible' END,
        'priorite', CASE WHEN score_val > 70 THEN 'Haute' WHEN score_val > 40 THEN 'Moyenne' ELSE 'Basse' END
      ),
      'proposition', jsonb_build_object(
        'pret', statut IN ('Proposition préparée','En attente validation','Contacté'),
        'message', 'Bonjour ' || prenoms[((i - 1) % array_length(prenoms, 1)) + 1] || E',\n\nJ\u0027ai remarqué que votre ' || lower(secteur) || ' à ' || ville || ' pourrait bénéficier d\u0027une meilleure présence en ligne. CYPOX peut vous aider à attirer plus de clients grâce à un site web professionnel et optimisé.\n\nSouhaitez-vous en discuter ?',
        'auditPret', (score_val > 50)
      ),
      'suivi', jsonb_build_object(
        'statut', statut,
        'historique', jsonb_build_array(
          jsonb_build_object('date', '01/01/2026', 'action', 'Découverte du prospect'),
          jsonb_build_object('date', '02/01/2026', 'action', 'Analyse automatique lancée'),
          CASE WHEN statut != 'Nouveau' THEN jsonb_build_object('date', '03/01/2026', 'action', 'Analyse terminée') ELSE null END,
          CASE WHEN statut IN ('Contacté','Converti') THEN jsonb_build_object('date', '05/01/2026', 'action', 'Prise de contact') ELSE null END
        )
      )
    );

    INSERT INTO prospects (nom, secteur, ville, telephone, email, site_web, fiche_google, score, statut, date_decouverte, details)
    VALUES (
      nom, secteur, ville, telephone, email_val, site_web_val,
      (i % 2 = 0),
      score_val, statut,
      (1 + (i % 28))::text || '/0' || (1 + (i % 6))::text || '/2026',
      detail
    );
  END LOOP;
END $$;
