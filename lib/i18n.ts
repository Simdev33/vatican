export const locales = ["en", "fr", "de", "es", "it"] as const

export type Locale = (typeof locales)[number]

export const localeLabels: Record<Locale, string> = {
  en: "English",
  fr: "Français",
  de: "Deutsch",
  es: "Español",
  it: "Italiano",
}

export function isLocale(value: string | null | undefined): value is Locale {
  return locales.includes(value as Locale)
}

type ProductCopy = {
  title: string
  subtitle: string
  duration: string
  category: string
  highlights: string[]
}

type Dictionary = {
  code: Locale
  ownershipNotice: string
  nav: {
    tickets: string
    gallery: string
    discover: string
    contact: string
    bookNow: string
  }
  hero: {
    titleTop: string
    titleHighlight: string
    titleBottom: string
    subtitle: string
    cta: string
    from: string
    banner: string
  }
  tickets: {
    heading: string
    subheading: string
    available: string
    selected: string
    selectTicket: string
    from: string
    perPerson: string
    availableOn: string
    badges: Record<"bestseller" | "popular" | "best-value", string>
    trustTitle: string
    trustItems: string[]
  }
  booking: {
    selectDate: string
    previousMonth: string
    nextMonth: string
    clearSelection: string
    today: string
    selectTime: string
    selectDateFirst: string
    dayPassCruise: string
    dayPassOnly: string
    closedDay: string
    name: string
    namePlaceholder: string
    nameError: string
    email: string
    emailPlaceholder: string
    emailError: string
    emailConfirmation: string
    emailConfirmationPlaceholder: string
    emailConfirmationError: string
    phone: string
    phonePlaceholder: string
    submitting: string
    completePurchase: string
    redirecting: string
    ticketTypes: string
    ticketTypeError: string
    selectedTicket: string
    selectedDate: string
    time: string
    at: string
    dayPass: string
  }
  sections: {
    howToBook: string
    steps: Array<{ number: string; title: string; description: string }>
    exploreTitle: string
    exploreSubtitle: string
    estimatedTime: string
    includes: string
    notIncluded: string
    discoverTitle: string
    discoverSubtitle: string
    viewAllArticles: string
    readMore: string
    testimonialsTitle: string
    testimonialsRating: string
    faqTitle: string
    faqSubtitle: string
  }
  footer: {
    description: string
    tickets: string
    information: string
    legal: string
    disclaimer: {
      title: string
      text: string
    }
    accept: string
    rights: string
    links: {
      tickets: string[]
      info: string[]
      legal: string[]
    }
  }
  products: Record<string, ProductCopy>
}

const enProducts: Record<string, ProductCopy> = {
  louvre: {
    title: "Louvre Museum",
    subtitle: "Timed Entry Ticket",
    duration: "2-3 hours",
    category: "Entry Ticket",
    highlights: ["Louvre Museum entry", "Access to permanent collections", "See the Mona Lisa", "Flexible visit experience"],
  },
  eiffel: {
    title: "Eiffel Tower",
    subtitle: "Tower Access Ticket",
    duration: "2 hours",
    category: "Entry Ticket",
    highlights: ["Eiffel Tower access", "Panoramic Paris views", "Timed entry slot", "Perfect for first-time visitors"],
  },
  boat: {
    title: "Seine River Cruise",
    subtitle: "Sightseeing Boat Ticket",
    duration: "1 hour",
    category: "River Cruise",
    highlights: ["Seine sightseeing cruise", "Views of Paris landmarks", "Flexible boarding", "Audio commentary available"],
  },
  "louvre-boat-eiffel": {
    title: "Louvre + Seine Cruise + Eiffel Tower",
    subtitle: "Best Value Combo Ticket",
    duration: "Full day",
    category: "Combo Ticket",
    highlights: ["Louvre Museum entry", "Seine River Cruise", "Eiffel Tower access", "Save with one combo ticket"],
  },
  "louvre-eiffel": {
    title: "Louvre + Eiffel Tower",
    subtitle: "Combo Ticket",
    duration: "Half day",
    category: "Combo Ticket",
    highlights: ["Louvre Museum entry", "Eiffel Tower access", "Timed entry slots", "Two Paris icons in one ticket"],
  },
  "eiffel-boat": {
    title: "Eiffel Tower + Seine Cruise",
    subtitle: "Combo Ticket",
    duration: "3 hours",
    category: "Combo Ticket",
    highlights: ["Eiffel Tower access", "Seine River Cruise", "Landmark views from water", "Great evening option"],
  },
}

export const dictionaries: Record<Locale, Dictionary> = {
  en: {
    code: "en",
    ownershipNotice: "ParisTourPass.com is owned and operated by TicketCompass.com.",
    nav: { tickets: "Tickets", gallery: "Gallery", discover: "Discover", contact: "Contact", bookNow: "Book Now" },
    hero: {
      titleTop: "Louvre, Eiffel Tower &",
      titleHighlight: "Seine Cruise",
      titleBottom: "Tickets",
      subtitle: "Book single attraction tickets or save with Paris combo experiences. Instant confirmation.",
      cta: "View All Tickets",
      from: "from",
      banner: "Louvre Museum, Eiffel Tower and Seine River Cruise: Book your Ticket Today",
    },
    tickets: {
      heading: "Choose Your Experience",
      subheading: "Select a date and explore our curated selection of Paris tickets and combo experiences",
      available: "Experiences Available",
      selected: "Selected",
      selectTicket: "Select Ticket",
      from: "from",
      perPerson: "per person",
      availableOn: "Available on",
      badges: { bestseller: "Most booked", popular: "Popular choice", "best-value": "Best value" },
      trustTitle: "Why Book With Us",
      trustItems: ["Free cancellation up to 24h", "Instant confirmation", "Skip the line to the cashier"],
    },
    booking: {
      selectDate: "Select Your Visit Date",
      previousMonth: "Previous month",
      nextMonth: "Next month",
      clearSelection: "Clear selection",
      today: "Today",
      selectTime: "Select Time",
      selectDateFirst: "Select a date first to choose a time slot.",
      dayPassCruise: "Seine Cruise tickets are valid all year and can be used anytime. Boarding is flexible between 10:00-22:00.",
      dayPassOnly: "Ticket valid all year - no time slot needed.",
      closedDay: "This day is closed for",
      name: "Name",
      namePlaceholder: "Your full name",
      nameError: "Please enter your full name (first and last name).",
      email: "Email",
      emailPlaceholder: "you@example.com",
      emailError: "Please enter a valid email address.",
      emailConfirmation: "Email Confirmation",
      emailConfirmationPlaceholder: "Repeat your email",
      emailConfirmationError: "Email addresses must match.",
      phone: "Phone Number",
      phonePlaceholder: "+36 30 123 4567",
      submitting: "Submitting...",
      completePurchase: "Complete Purchase",
      redirecting: "Order received. Redirecting to secure payment...",
      ticketTypes: "Ticket types",
      ticketTypeError: "Select at least one ticket type.",
      selectedTicket: "Selected ticket",
      selectedDate: "Selected date",
      time: "Time",
      at: "at",
      dayPass: "valid all year",
    },
    sections: {
      howToBook: "How to Book",
      steps: [
        { number: "01", title: "Select Your Date", description: "Choose the day and time for your Paris visit" },
        { number: "02", title: "Pick Your Experience", description: "Select from our range of tickets and tours" },
        { number: "03", title: "Book Securely", description: "Pay online and receive instant confirmation" },
      ],
      exploreTitle: "Explore Our Experiences",
      exploreSubtitle: "Discover the best ways to experience the Louvre, Eiffel Tower, and Seine River",
      estimatedTime: "The estimated visiting time is around",
      includes: "Includes",
      notIncluded: "Not included",
      discoverTitle: "Discover Paris",
      discoverSubtitle: "Learn more about these magnificent places before your visit",
      viewAllArticles: "View all articles",
      readMore: "Read More",
      testimonialsTitle: "What Our Visitors Say",
      testimonialsRating: "4.9/5 based on 12,000+ reviews",
      faqTitle: "Frequently Asked Questions",
      faqSubtitle: "Quick answers before you complete your booking.",
    },
    footer: {
      description: "Your trusted partner for Louvre, Eiffel Tower, Seine River Cruise, and Paris combo tickets. Providing seamless booking experiences since 2015.",
      tickets: "Tickets",
      information: "Contact",
      legal: "Legal",
      disclaimer: {
        title: "Disclaimer",
        text: "This website (paristourpass.com) operates as an independent provider of tourist services and is not affiliated with, sponsored by, authorized by, or operated by the Louvre Museum or any of its official managing entities. Our purpose is to enhance the visitor experience by offering independent services, including valid and official admission tickets and supplementary digital content such as audio guides. Ticket Validity: All tickets offered on this website are genuine and officially valid, procured through authorized distribution channels. Pricing: Our listed prices may incorporate additional costs covering management fees, early availability access, dedicated customer service, and the provision of digital materials. Trademarks: Trademarks, logos, and official names of the monuments mentioned are the exclusive property of their respective owners. They are used strictly for descriptive purposes only, with no intent to cause confusion or claim ownership. Operated by TicketCompass OÜ, Karamelli tn 2, 11317 Kesklinna linnaosa, Tallinn, Estonia, Tax Number: EE102778049, Company Register: 17069651.",
      },
      accept: "We accept:",
      rights: "All rights reserved.",
      links: {
        tickets: ["Louvre Museum", "Eiffel Tower", "Seine River Cruise", "Paris Combo Tickets"],
        info: ["About Us", "Opening Hours", "FAQ", "Contact"],
        legal: ["Privacy Policy", "Terms of Service", "Cancellation Policy", "Cookie Policy"],
      },
    },
    products: enProducts,
  },
  fr: {
    code: "fr",
    ownershipNotice: "ParisTourPass.com est détenu et exploité par TicketCompass.com.",
    nav: { tickets: "Billets", gallery: "Galerie", discover: "Découvrir", contact: "Contact", bookNow: "Réserver" },
    hero: {
      titleTop: "Billets Louvre, tour Eiffel et",
      titleHighlight: "croisière sur la Seine",
      titleBottom: "",
      subtitle: "Réservez des billets simples ou économisez avec des expériences combinées à Paris. Confirmation instantanée.",
      cta: "Voir tous les billets",
      from: "dès",
      banner: "Musée du Louvre, tour Eiffel et croisière sur la Seine : réservez votre billet aujourd'hui",
    },
    tickets: {
      heading: "Choisissez votre expérience",
      subheading: "Choisissez une date et découvrez notre sélection de billets et combos à Paris",
      available: "expériences disponibles",
      selected: "Sélectionné",
      selectTicket: "Choisir",
      from: "dès",
      perPerson: "par personne",
      availableOn: "Disponible le",
      badges: { bestseller: "Le plus réservé", popular: "Choix populaire", "best-value": "Meilleur prix" },
      trustTitle: "Pourquoi réserver avec nous",
      trustItems: ["Annulation gratuite jusqu'à 24 h", "Confirmation instantanée", "Évitez la file à la caisse"],
    },
    booking: {
      selectDate: "Choisissez votre date de visite",
      previousMonth: "Mois précédent",
      nextMonth: "Mois suivant",
      clearSelection: "Effacer la sélection",
      today: "Aujourd'hui",
      selectTime: "Choisir l'heure",
      selectDateFirst: "Choisissez d'abord une date pour sélectionner un horaire.",
      dayPassCruise: "La croisière sur la Seine est un pass journée. Embarquement flexible entre 10:00 et 22:00.",
      dayPassOnly: "Pass journée uniquement - aucun horaire nécessaire.",
      closedDay: "Ce jour est fermé pour",
      name: "Nom",
      namePlaceholder: "Votre nom complet",
      nameError: "Veuillez saisir votre nom complet.",
      email: "Email",
      emailPlaceholder: "vous@example.com",
      emailError: "Veuillez saisir une adresse email valide.",
      emailConfirmation: "Confirmation email",
      emailConfirmationPlaceholder: "Répétez votre email",
      emailConfirmationError: "Les adresses email doivent correspondre.",
      phone: "Téléphone",
      phonePlaceholder: "+33 6 12 34 56 78",
      submitting: "Envoi...",
      completePurchase: "Finaliser l'achat",
      redirecting: "Commande reçue. Redirection vers le paiement sécurisé...",
      ticketTypes: "Types de billets",
      ticketTypeError: "Sélectionnez au moins un type de billet.",
      selectedTicket: "Billet sélectionné",
      selectedDate: "Date sélectionnée",
      time: "Heure",
      at: "à",
      dayPass: "pass journée",
    },
    sections: {
      howToBook: "Comment réserver",
      steps: [
        { number: "01", title: "Choisissez votre date", description: "Choisissez le jour et l'heure de votre visite à Paris" },
        { number: "02", title: "Choisissez votre expérience", description: "Sélectionnez parmi nos billets et visites" },
        { number: "03", title: "Réservez en sécurité", description: "Payez en ligne et recevez une confirmation instantanée" },
      ],
      exploreTitle: "Explorez nos expériences",
      exploreSubtitle: "Découvrez les meilleures façons de visiter le Louvre, la tour Eiffel et la Seine",
      estimatedTime: "La durée de visite estimée est d'environ",
      includes: "Inclus",
      notIncluded: "Non inclus",
      discoverTitle: "Découvrir Paris",
      discoverSubtitle: "En savoir plus sur ces lieux magnifiques avant votre visite",
      viewAllArticles: "Voir tous les articles",
      readMore: "Lire la suite",
      testimonialsTitle: "Ce que disent nos visiteurs",
      testimonialsRating: "4,9/5 basé sur plus de 12 000 avis",
      faqTitle: "Questions fréquentes",
      faqSubtitle: "Réponses rapides avant de finaliser votre réservation.",
    },
    footer: {
      description: "Votre partenaire de confiance pour les billets Louvre, tour Eiffel, croisière sur la Seine et combos à Paris.",
      tickets: "Billets",
      information: "Contact",
      legal: "Mentions légales",
      disclaimer: {
        title: "Avertissement",
        text: "Ce site web (paristourpass.com) fonctionne comme un prestataire indépendant de services touristiques et n'est pas affilié, sponsorisé, autorisé ni exploité par le musée du Louvre ou l'une de ses entités officielles de gestion. Notre objectif est d'améliorer l'expérience des visiteurs en proposant des services indépendants, notamment des billets d'entrée valides et officiels ainsi que des contenus numériques complémentaires tels que des audioguides. Validité des billets : tous les billets proposés sur ce site sont authentiques et officiellement valides, obtenus par des canaux de distribution autorisés. Prix : nos prix affichés peuvent inclure des coûts supplémentaires couvrant les frais de gestion, l'accès anticipé aux disponibilités, le service client dédié et la fourniture de contenus numériques. Marques : les marques, logos et noms officiels des monuments mentionnés sont la propriété exclusive de leurs propriétaires respectifs. Ils sont utilisés uniquement à des fins descriptives, sans intention de créer une confusion ou de revendiquer un droit de propriété. Exploité par TicketCompass OÜ, Karamelli tn 2, 11317 Kesklinna linnaosa, Tallinn, Estonie, Tax Number : EE102778049, Company Register : 17069651.",
      },
      accept: "Nous acceptons :",
      rights: "Tous droits réservés.",
      links: {
        tickets: ["Musée du Louvre", "Tour Eiffel", "Croisière sur la Seine", "Combos Paris"],
        info: ["À propos", "Horaires", "FAQ", "Contact"],
        legal: ["Politique de confidentialité", "Conditions d'utilisation", "Politique d'annulation", "Politique cookies"],
      },
    },
    products: {
      louvre: { ...enProducts.louvre, title: "Musée du Louvre", subtitle: "Billet d'entrée horodaté", category: "Billet d'entrée", duration: "2-3 heures", highlights: ["Entrée au musée du Louvre", "Accès aux collections permanentes", "Voir la Joconde", "Visite flexible"] },
      eiffel: { ...enProducts.eiffel, title: "Tour Eiffel", subtitle: "Billet d'accès à la tour", category: "Billet d'entrée", duration: "2 heures", highlights: ["Accès à la tour Eiffel", "Vues panoramiques de Paris", "Créneau horodaté", "Idéal pour une première visite"] },
      boat: { ...enProducts.boat, title: "Croisière sur la Seine", subtitle: "Billet bateau touristique", category: "Croisière", duration: "1 heure", highlights: ["Croisière touristique sur la Seine", "Vues des monuments de Paris", "Embarquement flexible", "Audioguide disponible"] },
      "louvre-boat-eiffel": { ...enProducts["louvre-boat-eiffel"], title: "Louvre + Seine + tour Eiffel", subtitle: "Combo meilleur prix", category: "Billet combo", duration: "Journée complète", highlights: ["Entrée au Louvre", "Croisière sur la Seine", "Accès à la tour Eiffel", "Économisez avec un combo"] },
      "louvre-eiffel": { ...enProducts["louvre-eiffel"], title: "Louvre + tour Eiffel", subtitle: "Billet combo", category: "Billet combo", duration: "Demi-journée", highlights: ["Entrée au Louvre", "Accès à la tour Eiffel", "Créneaux horodatés", "Deux icônes de Paris"] },
      "eiffel-boat": { ...enProducts["eiffel-boat"], title: "Tour Eiffel + Seine", subtitle: "Billet combo", category: "Billet combo", duration: "3 heures", highlights: ["Accès à la tour Eiffel", "Croisière sur la Seine", "Vues depuis l'eau", "Parfait en soirée"] },
    },
  },
  de: {
    code: "de",
    ownershipNotice: "ParisTourPass.com ist Eigentum von TicketCompass.com und wird von TicketCompass.com betrieben.",
    nav: { tickets: "Tickets", gallery: "Galerie", discover: "Entdecken", contact: "Kontakt", bookNow: "Jetzt buchen" },
    hero: {
      titleTop: "Louvre, Eiffelturm &",
      titleHighlight: "Seine-Kreuzfahrt",
      titleBottom: "Tickets",
      subtitle: "Buchen Sie Einzeltickets oder sparen Sie mit Paris-Kombierlebnissen. Sofortige Bestätigung.",
      cta: "Alle Tickets ansehen",
      from: "ab",
      banner: "Louvre, Eiffelturm und Seine-Kreuzfahrt: Buchen Sie Ihr Ticket heute",
    },
    tickets: {
      heading: "Wählen Sie Ihr Erlebnis",
      subheading: "Wählen Sie ein Datum und entdecken Sie unsere Paris-Tickets und Kombierlebnisse",
      available: "Erlebnisse verfügbar",
      selected: "Ausgewählt",
      selectTicket: "Ticket wählen",
      from: "ab",
      perPerson: "pro Person",
      availableOn: "Verfügbar am",
      badges: { bestseller: "Meistgebucht", popular: "Beliebte Wahl", "best-value": "Bester Wert" },
      trustTitle: "Warum bei uns buchen",
      trustItems: ["Kostenlose Stornierung bis 24 Std.", "Sofortige Bestätigung", "Überspringen Sie die Warteschlange an der Kasse"],
    },
    booking: {
      selectDate: "Besuchsdatum wählen",
      previousMonth: "Vorheriger Monat",
      nextMonth: "Nächster Monat",
      clearSelection: "Auswahl löschen",
      today: "Heute",
      selectTime: "Uhrzeit wählen",
      selectDateFirst: "Wählen Sie zuerst ein Datum, um eine Uhrzeit auszuwählen.",
      dayPassCruise: "Die Seine-Kreuzfahrt ist ein Tagespass. Einstieg flexibel zwischen 10:00 und 22:00.",
      dayPassOnly: "Nur Tagespass - keine Uhrzeit nötig.",
      closedDay: "Dieser Tag ist geschlossen für",
      name: "Name",
      namePlaceholder: "Ihr vollständiger Name",
      nameError: "Bitte geben Sie Ihren vollständigen Namen ein.",
      email: "E-Mail",
      emailPlaceholder: "sie@example.com",
      emailError: "Bitte geben Sie eine gültige E-Mail-Adresse ein.",
      emailConfirmation: "E-Mail bestätigen",
      emailConfirmationPlaceholder: "E-Mail wiederholen",
      emailConfirmationError: "Die E-Mail-Adressen müssen übereinstimmen.",
      phone: "Telefonnummer",
      phonePlaceholder: "+49 30 123456",
      submitting: "Wird gesendet...",
      completePurchase: "Kauf abschließen",
      redirecting: "Bestellung erhalten. Weiterleitung zur sicheren Zahlung...",
      ticketTypes: "Ticketarten",
      ticketTypeError: "Wählen Sie mindestens eine Ticketart aus.",
      selectedTicket: "Ausgewähltes Ticket",
      selectedDate: "Ausgewähltes Datum",
      time: "Uhrzeit",
      at: "um",
      dayPass: "Tagespass",
    },
    sections: {
      howToBook: "So buchen Sie",
      steps: [
        { number: "01", title: "Datum wählen", description: "Wählen Sie Tag und Uhrzeit Ihres Paris-Besuchs" },
        { number: "02", title: "Erlebnis wählen", description: "Wählen Sie aus unseren Tickets und Touren" },
        { number: "03", title: "Sicher buchen", description: "Online bezahlen und sofortige Bestätigung erhalten" },
      ],
      exploreTitle: "Unsere Erlebnisse",
      exploreSubtitle: "Entdecken Sie Louvre, Eiffelturm und Seine auf die beste Weise",
      estimatedTime: "Die geschätzte Besuchszeit beträgt etwa",
      includes: "Inklusive",
      notIncluded: "Nicht inklusive",
      discoverTitle: "Paris entdecken",
      discoverSubtitle: "Erfahren Sie vor Ihrem Besuch mehr über diese Orte",
      viewAllArticles: "Alle Artikel ansehen",
      readMore: "Weiterlesen",
      testimonialsTitle: "Was unsere Besucher sagen",
      testimonialsRating: "4,9/5 basierend auf über 12.000 Bewertungen",
      faqTitle: "Häufige Fragen",
      faqSubtitle: "Kurze Antworten vor Abschluss Ihrer Buchung.",
    },
    footer: {
      description: "Ihr zuverlässiger Partner für Louvre-, Eiffelturm-, Seine-Kreuzfahrt- und Paris-Kombitickets.",
      tickets: "Tickets",
      information: "Kontakt",
      legal: "Rechtliches",
      disclaimer: {
        title: "Haftungsausschluss",
        text: "Diese Website (paristourpass.com) wird als unabhängiger Anbieter touristischer Dienstleistungen betrieben und ist weder mit dem Louvre-Museum noch mit einer seiner offiziellen Verwaltungseinheiten verbunden, gesponsert, autorisiert oder von diesen betrieben. Unser Ziel ist es, das Besuchererlebnis durch unabhängige Dienstleistungen zu verbessern, einschließlich gültiger und offizieller Eintrittskarten sowie ergänzender digitaler Inhalte wie Audioguides. Ticketgültigkeit: Alle auf dieser Website angebotenen Tickets sind echt und offiziell gültig und werden über autorisierte Vertriebskanäle bezogen. Preise: Unsere angegebenen Preise können zusätzliche Kosten für Verwaltungsgebühren, frühzeitigen Verfügbarkeitszugang, engagierten Kundenservice und die Bereitstellung digitaler Materialien enthalten. Marken: Marken, Logos und offizielle Namen der genannten Sehenswürdigkeiten sind ausschließliches Eigentum ihrer jeweiligen Inhaber. Sie werden nur zu beschreibenden Zwecken verwendet, ohne Verwechslungsabsicht oder Eigentumsanspruch. Betrieben von TicketCompass OÜ, Karamelli tn 2, 11317 Kesklinna linnaosa, Tallinn, Estland, Tax Number: EE102778049, Company Register: 17069651.",
      },
      accept: "Wir akzeptieren:",
      rights: "Alle Rechte vorbehalten.",
      links: {
        tickets: ["Louvre", "Eiffelturm", "Seine-Kreuzfahrt", "Paris-Kombitickets"],
        info: ["Über uns", "Öffnungszeiten", "FAQ", "Kontakt"],
        legal: ["Datenschutz", "Nutzungsbedingungen", "Stornierungsbedingungen", "Cookie-Richtlinie"],
      },
    },
    products: {
      louvre: { ...enProducts.louvre, title: "Louvre", subtitle: "Ticket mit Zeitfenster", category: "Eintrittsticket", duration: "2-3 Stunden", highlights: ["Eintritt in den Louvre", "Zugang zu Dauerausstellungen", "Mona Lisa sehen", "Flexibler Besuch"] },
      eiffel: { ...enProducts.eiffel, title: "Eiffelturm", subtitle: "Zugangsticket", category: "Eintrittsticket", duration: "2 Stunden", highlights: ["Zugang zum Eiffelturm", "Panoramablick auf Paris", "Zeitfenster", "Ideal für Erstbesucher"] },
      boat: { ...enProducts.boat, title: "Seine-Kreuzfahrt", subtitle: "Sightseeing-Bootsticket", category: "Flussfahrt", duration: "1 Stunde", highlights: ["Seine-Sightseeing-Fahrt", "Blick auf Pariser Wahrzeichen", "Flexibler Einstieg", "Audiokommentar verfügbar"] },
      "louvre-boat-eiffel": { ...enProducts["louvre-boat-eiffel"], title: "Louvre + Seine + Eiffelturm", subtitle: "Bestes Kombiticket", category: "Kombiticket", duration: "Ganzer Tag", highlights: ["Louvre-Eintritt", "Seine-Kreuzfahrt", "Eiffelturm-Zugang", "Sparen mit Kombiticket"] },
      "louvre-eiffel": { ...enProducts["louvre-eiffel"], title: "Louvre + Eiffelturm", subtitle: "Kombiticket", category: "Kombiticket", duration: "Halber Tag", highlights: ["Louvre-Eintritt", "Eiffelturm-Zugang", "Zeitfenster", "Zwei Paris-Ikonen"] },
      "eiffel-boat": { ...enProducts["eiffel-boat"], title: "Eiffelturm + Seine", subtitle: "Kombiticket", category: "Kombiticket", duration: "3 Stunden", highlights: ["Eiffelturm-Zugang", "Seine-Kreuzfahrt", "Blick vom Wasser", "Tolle Abendoption"] },
    },
  },
  es: {
    code: "es",
    ownershipNotice: "ParisTourPass.com es propiedad de TicketCompass.com y está operado por TicketCompass.com.",
    nav: { tickets: "Entradas", gallery: "Galería", discover: "Descubrir", contact: "Contacto", bookNow: "Reservar" },
    hero: {
      titleTop: "Entradas Louvre, Torre Eiffel y",
      titleHighlight: "crucero por el Sena",
      titleBottom: "",
      subtitle: "Reserva entradas individuales o ahorra con experiencias combinadas en París. Confirmación instantánea.",
      cta: "Ver entradas",
      from: "desde",
      banner: "Museo del Louvre, Torre Eiffel y crucero por el Sena: reserva tu entrada hoy",
    },
    tickets: {
      heading: "Elige tu experiencia",
      subheading: "Selecciona una fecha y explora nuestra selección de entradas y combos de París",
      available: "experiencias disponibles",
      selected: "Seleccionado",
      selectTicket: "Elegir entrada",
      from: "desde",
      perPerson: "por persona",
      availableOn: "Disponible el",
      badges: { bestseller: "Más reservado", popular: "Opción popular", "best-value": "Mejor precio" },
      trustTitle: "Por qué reservar con nosotros",
      trustItems: ["Cancelación gratis hasta 24 h", "Confirmación instantánea", "Evita la cola en la caja"],
    },
    booking: {
      selectDate: "Selecciona la fecha de visita",
      previousMonth: "Mes anterior",
      nextMonth: "Mes siguiente",
      clearSelection: "Borrar selección",
      today: "Hoy",
      selectTime: "Seleccionar hora",
      selectDateFirst: "Selecciona primero una fecha para elegir una hora.",
      dayPassCruise: "El crucero por el Sena es un pase de día. Embarque flexible entre 10:00 y 22:00.",
      dayPassOnly: "Solo pase de día - no hace falta hora.",
      closedDay: "Este día está cerrado para",
      name: "Nombre",
      namePlaceholder: "Tu nombre completo",
      nameError: "Introduce tu nombre completo.",
      email: "Email",
      emailPlaceholder: "tu@example.com",
      emailError: "Introduce un email válido.",
      emailConfirmation: "Confirmar email",
      emailConfirmationPlaceholder: "Repite tu email",
      emailConfirmationError: "Los emails deben coincidir.",
      phone: "Teléfono",
      phonePlaceholder: "+34 600 123 456",
      submitting: "Enviando...",
      completePurchase: "Finalizar compra",
      redirecting: "Pedido recibido. Redirigiendo al pago seguro...",
      ticketTypes: "Tipos de entrada",
      ticketTypeError: "Selecciona al menos un tipo de entrada.",
      selectedTicket: "Entrada seleccionada",
      selectedDate: "Fecha seleccionada",
      time: "Hora",
      at: "a las",
      dayPass: "pase de día",
    },
    sections: {
      howToBook: "Cómo reservar",
      steps: [
        { number: "01", title: "Selecciona la fecha", description: "Elige el día y la hora de tu visita a París" },
        { number: "02", title: "Elige tu experiencia", description: "Selecciona entre nuestras entradas y tours" },
        { number: "03", title: "Reserva con seguridad", description: "Paga online y recibe confirmación instantánea" },
      ],
      exploreTitle: "Explora nuestras experiencias",
      exploreSubtitle: "Descubre las mejores formas de visitar el Louvre, la Torre Eiffel y el Sena",
      estimatedTime: "La duración estimada de la visita es de aproximadamente",
      includes: "Incluye",
      notIncluded: "No incluido",
      discoverTitle: "Descubre París",
      discoverSubtitle: "Conoce más sobre estos lugares antes de tu visita",
      viewAllArticles: "Ver todos los artículos",
      readMore: "Leer más",
      testimonialsTitle: "Qué dicen nuestros visitantes",
      testimonialsRating: "4,9/5 basado en más de 12.000 reseñas",
      faqTitle: "Preguntas frecuentes",
      faqSubtitle: "Respuestas rápidas antes de completar tu reserva.",
    },
    footer: {
      description: "Tu socio de confianza para entradas al Louvre, Torre Eiffel, crucero por el Sena y combos de París.",
      tickets: "Entradas",
      information: "Contacto",
      legal: "Legal",
      disclaimer: {
        title: "Aviso legal",
        text: "Este sitio web (paristourpass.com) opera como proveedor independiente de servicios turísticos y no está afiliado, patrocinado, autorizado ni gestionado por el Museo del Louvre ni por ninguna de sus entidades oficiales de gestión. Nuestro objetivo es mejorar la experiencia del visitante ofreciendo servicios independientes, incluidas entradas válidas y oficiales y contenido digital complementario como audioguías. Validez de las entradas: todas las entradas ofrecidas en este sitio web son auténticas y oficialmente válidas, obtenidas a través de canales de distribución autorizados. Precios: nuestros precios publicados pueden incluir costes adicionales que cubren gastos de gestión, acceso anticipado a disponibilidad, atención al cliente dedicada y la provisión de materiales digitales. Marcas comerciales: las marcas, logotipos y nombres oficiales de los monumentos mencionados son propiedad exclusiva de sus respectivos titulares. Se utilizan únicamente con fines descriptivos, sin intención de causar confusión ni reclamar titularidad. Operado por TicketCompass OÜ, Karamelli tn 2, 11317 Kesklinna linnaosa, Tallinn, Estonia, Tax Number: EE102778049, Company Register: 17069651.",
      },
      accept: "Aceptamos:",
      rights: "Todos los derechos reservados.",
      links: {
        tickets: ["Museo del Louvre", "Torre Eiffel", "Crucero por el Sena", "Combos París"],
        info: ["Sobre nosotros", "Horarios", "FAQ", "Contacto"],
        legal: ["Privacidad", "Términos del servicio", "Política de cancelación", "Política de cookies"],
      },
    },
    products: {
      louvre: { ...enProducts.louvre, title: "Museo del Louvre", subtitle: "Entrada con horario", category: "Entrada", duration: "2-3 horas", highlights: ["Entrada al Louvre", "Acceso a colecciones permanentes", "Ver la Mona Lisa", "Visita flexible"] },
      eiffel: { ...enProducts.eiffel, title: "Torre Eiffel", subtitle: "Entrada de acceso", category: "Entrada", duration: "2 horas", highlights: ["Acceso a la Torre Eiffel", "Vistas panorámicas de París", "Franja horaria", "Perfecto para primera visita"] },
      boat: { ...enProducts.boat, title: "Crucero por el Sena", subtitle: "Billete de barco turístico", category: "Crucero", duration: "1 hora", highlights: ["Crucero turístico por el Sena", "Vistas de monumentos", "Embarque flexible", "Audioguía disponible"] },
      "louvre-boat-eiffel": { ...enProducts["louvre-boat-eiffel"], title: "Louvre + Sena + Torre Eiffel", subtitle: "Combo mejor precio", category: "Entrada combo", duration: "Día completo", highlights: ["Entrada al Louvre", "Crucero por el Sena", "Acceso a la Torre Eiffel", "Ahorra con un combo"] },
      "louvre-eiffel": { ...enProducts["louvre-eiffel"], title: "Louvre + Torre Eiffel", subtitle: "Entrada combo", category: "Entrada combo", duration: "Medio día", highlights: ["Entrada al Louvre", "Acceso a Torre Eiffel", "Horarios programados", "Dos iconos de París"] },
      "eiffel-boat": { ...enProducts["eiffel-boat"], title: "Torre Eiffel + Sena", subtitle: "Entrada combo", category: "Entrada combo", duration: "3 horas", highlights: ["Acceso a Torre Eiffel", "Crucero por el Sena", "Vistas desde el agua", "Gran opción nocturna"] },
    },
  },
  it: {
    code: "it",
    ownershipNotice: "ParisTourPass.com è di proprietà di TicketCompass.com ed è gestito da TicketCompass.com.",
    nav: { tickets: "Biglietti", gallery: "Galleria", discover: "Scopri", contact: "Contatti", bookNow: "Prenota" },
    hero: {
      titleTop: "Biglietti Louvre, Torre Eiffel e",
      titleHighlight: "crociera sulla Senna",
      titleBottom: "",
      subtitle: "Prenota biglietti singoli o risparmia con esperienze combinate a Parigi. Conferma immediata.",
      cta: "Vedi tutti i biglietti",
      from: "da",
      banner: "Museo del Louvre, Torre Eiffel e crociera sulla Senna: prenota oggi il tuo biglietto",
    },
    tickets: {
      heading: "Scegli la tua esperienza",
      subheading: "Seleziona una data e scopri la nostra selezione di biglietti e combo per Parigi",
      available: "esperienze disponibili",
      selected: "Selezionato",
      selectTicket: "Seleziona",
      from: "da",
      perPerson: "a persona",
      availableOn: "Disponibile il",
      badges: { bestseller: "Più prenotato", popular: "Scelta popolare", "best-value": "Miglior valore" },
      trustTitle: "Perché prenotare con noi",
      trustItems: ["Cancellazione gratuita fino a 24h", "Conferma immediata", "Salta la fila alla cassa"],
    },
    booking: {
      selectDate: "Seleziona la data di visita",
      previousMonth: "Mese precedente",
      nextMonth: "Mese successivo",
      clearSelection: "Cancella selezione",
      today: "Oggi",
      selectTime: "Seleziona orario",
      selectDateFirst: "Seleziona prima una data per scegliere un orario.",
      dayPassCruise: "La crociera sulla Senna è un pass giornaliero. Imbarco flessibile tra 10:00 e 22:00.",
      dayPassOnly: "Solo pass giornaliero - nessun orario necessario.",
      closedDay: "Questo giorno è chiuso per",
      name: "Nome",
      namePlaceholder: "Il tuo nome completo",
      nameError: "Inserisci il tuo nome completo.",
      email: "Email",
      emailPlaceholder: "tu@example.com",
      emailError: "Inserisci un indirizzo email valido.",
      emailConfirmation: "Conferma email",
      emailConfirmationPlaceholder: "Ripeti la tua email",
      emailConfirmationError: "Gli indirizzi email devono coincidere.",
      phone: "Telefono",
      phonePlaceholder: "+39 300 123 4567",
      submitting: "Invio...",
      completePurchase: "Completa acquisto",
      redirecting: "Ordine ricevuto. Reindirizzamento al pagamento sicuro...",
      ticketTypes: "Tipi di biglietto",
      ticketTypeError: "Seleziona almeno un tipo di biglietto.",
      selectedTicket: "Biglietto selezionato",
      selectedDate: "Data selezionata",
      time: "Ora",
      at: "alle",
      dayPass: "pass giornaliero",
    },
    sections: {
      howToBook: "Come prenotare",
      steps: [
        { number: "01", title: "Seleziona la data", description: "Scegli giorno e orario della tua visita a Parigi" },
        { number: "02", title: "Scegli l'esperienza", description: "Seleziona tra biglietti e tour disponibili" },
        { number: "03", title: "Prenota in sicurezza", description: "Paga online e ricevi conferma immediata" },
      ],
      exploreTitle: "Esplora le nostre esperienze",
      exploreSubtitle: "Scopri i modi migliori per visitare Louvre, Torre Eiffel e Senna",
      estimatedTime: "La durata stimata della visita è di circa",
      includes: "Include",
      notIncluded: "Non incluso",
      discoverTitle: "Scopri Parigi",
      discoverSubtitle: "Scopri di più su questi luoghi prima della visita",
      viewAllArticles: "Vedi tutti gli articoli",
      readMore: "Leggi di più",
      testimonialsTitle: "Cosa dicono i visitatori",
      testimonialsRating: "4,9/5 basato su oltre 12.000 recensioni",
      faqTitle: "Domande frequenti",
      faqSubtitle: "Risposte rapide prima di completare la prenotazione.",
    },
    footer: {
      description: "Il tuo partner di fiducia per biglietti Louvre, Torre Eiffel, crociera sulla Senna e combo Parigi.",
      tickets: "Biglietti",
      information: "Contatti",
      legal: "Legale",
      disclaimer: {
        title: "Disclaimer",
        text: "Questo sito web (paristourpass.com) opera come fornitore indipendente di servizi turistici e non è affiliato, sponsorizzato, autorizzato o gestito dal Museo del Louvre né da alcuna delle sue entità ufficiali di gestione. Il nostro obiettivo è migliorare l'esperienza dei visitatori offrendo servizi indipendenti, inclusi biglietti d'ingresso validi e ufficiali e contenuti digitali supplementari come audioguide. Validità dei biglietti: tutti i biglietti offerti su questo sito sono autentici e ufficialmente validi, acquistati tramite canali di distribuzione autorizzati. Prezzi: i prezzi indicati possono includere costi aggiuntivi relativi a commissioni di gestione, accesso anticipato alla disponibilità, servizio clienti dedicato e fornitura di materiali digitali. Marchi: marchi, loghi e nomi ufficiali dei monumenti citati sono di proprietà esclusiva dei rispettivi titolari. Sono utilizzati esclusivamente a scopo descrittivo, senza intenzione di creare confusione o rivendicare proprietà. Gestito da TicketCompass OÜ, Karamelli tn 2, 11317 Kesklinna linnaosa, Tallinn, Estonia, Tax Number: EE102778049, Company Register: 17069651.",
      },
      accept: "Accettiamo:",
      rights: "Tutti i diritti riservati.",
      links: {
        tickets: ["Museo del Louvre", "Torre Eiffel", "Crociera sulla Senna", "Combo Parigi"],
        info: ["Chi siamo", "Orari", "FAQ", "Contatti"],
        legal: ["Privacy Policy", "Termini di servizio", "Politica di cancellazione", "Cookie Policy"],
      },
    },
    products: {
      louvre: { ...enProducts.louvre, title: "Museo del Louvre", subtitle: "Biglietto con ingresso orario", category: "Biglietto d'ingresso", duration: "2-3 ore", highlights: ["Ingresso al Louvre", "Accesso alle collezioni permanenti", "Vedi la Gioconda", "Visita flessibile"] },
      eiffel: { ...enProducts.eiffel, title: "Torre Eiffel", subtitle: "Biglietto di accesso", category: "Biglietto d'ingresso", duration: "2 ore", highlights: ["Accesso alla Torre Eiffel", "Vista panoramica su Parigi", "Fascia oraria", "Perfetto per prima visita"] },
      boat: { ...enProducts.boat, title: "Crociera sulla Senna", subtitle: "Biglietto battello turistico", category: "Crociera", duration: "1 ora", highlights: ["Crociera turistica sulla Senna", "Vista sui monumenti", "Imbarco flessibile", "Audioguida disponibile"] },
      "louvre-boat-eiffel": { ...enProducts["louvre-boat-eiffel"], title: "Louvre + Senna + Torre Eiffel", subtitle: "Combo miglior valore", category: "Biglietto combo", duration: "Giornata intera", highlights: ["Ingresso al Louvre", "Crociera sulla Senna", "Accesso Torre Eiffel", "Risparmia con un combo"] },
      "louvre-eiffel": { ...enProducts["louvre-eiffel"], title: "Louvre + Torre Eiffel", subtitle: "Biglietto combo", category: "Biglietto combo", duration: "Mezza giornata", highlights: ["Ingresso al Louvre", "Accesso Torre Eiffel", "Fasce orarie", "Due icone di Parigi"] },
      "eiffel-boat": { ...enProducts["eiffel-boat"], title: "Torre Eiffel + Senna", subtitle: "Biglietto combo", category: "Biglietto combo", duration: "3 ore", highlights: ["Accesso Torre Eiffel", "Crociera sulla Senna", "Vista dall'acqua", "Ottima opzione serale"] },
    },
  },
}

export function getDictionary(locale: Locale) {
  return dictionaries[locale]
}
