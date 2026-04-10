export type Language = 'en' | 'ar' | 'fr';

export const languageNames: Record<Language, string> = {
  en: 'English',
  ar: 'العربية',
  fr: 'Français',
};

export const translations: Record<Language, Record<string, string>> = {
  en: {
    // Header
    'app.name': 'Ouribadah',
    'app.subtitle': 'Our Worship',
    'auth.signIn': 'Sign In',
    'auth.signOut': 'Sign Out',
    'auth.welcomeBack': 'Welcome back!',

    // Hero
    'hero.title': 'Connecting Worship, Community, and Daily Life',
    'hero.subtitle': 'Your comprehensive Islamic companion for prayer times, Qibla direction, mosque finder, and community connection.',
    'hero.viewPrayerTimes': 'View Prayer Times',
    'hero.findQibla': 'Find Qibla',
    'hero.muslims': 'Muslims',
    'hero.mosques': 'Mosques',
    'hero.accuracy': 'Accuracy',

    // Share
    'share.title': 'Share Ouribadah',
    'share.subtitle': 'Help others discover our Islamic community',

    // Features
    'features.title': 'Explore More Features',
    'features.subtitle': 'Discover halal food, Islamic events, and connect with your local Muslim community',

    // Social
    'social.title': 'Follow Us',
    'social.subtitle': 'Stay connected with the Ouribadah community',

    // Footer
    'footer.tagline': 'Strengthening the Muslim community through technology',
    'footer.privacy': 'Privacy Policy',
    'footer.terms': 'Terms of Service',
    'footer.contact': 'Contact Us',

    // Prayer Times
    'prayer.title': 'Prayer Times',
    'prayer.next': 'Next prayer:',
    'prayer.in': 'in',
    'prayer.locationUnavailable': 'Location unavailable',
    'prayer.gettingLocation': 'Getting location...',

    // Qibla
    'qibla.title': 'Qibla Direction',
    'qibla.fromNorth': 'from North',
    'qibla.pointDevice': 'Point your device towards the golden arrow',
    'qibla.calibrate': "Move your phone in a '∞' to calibrate the compass",
    'qibla.deviceHeading': 'Device heading:',
    'qibla.enableCompass': 'Enable Compass',
    'qibla.locationUnavailable': 'Location unavailable',

    // Mosques
    'mosques.title': 'Find Mosques',
    'mosques.subtitle': 'Locate nearby mosques with prayer times and facilities',
    'mosques.searchRadius': 'Search Radius',
    'mosques.openNow': 'Open now only',
    'mosques.search': 'Search Mosques',
    'mosques.gettingLocation': 'Getting Location...',
    'mosques.searching': 'Searching...',
    'mosques.found': 'Found',
    'mosques.noFound': 'No Mosques Found',
    'mosques.noFoundHint': 'Try increasing the search radius or removing filters',
    'mosques.expandSearch': 'Expand Search to 10km',
    'mosques.locationNeeded': 'Location access is needed to find nearby mosques',
    'mosques.useGPS': 'Use GPS',
    'mosques.setManually': 'Set Manually',
    'mosques.switchToManual': 'Switch to Manual',
    'mosques.switchToAuto': 'Switch to Auto',
    'mosques.autoLocation': 'Auto location:',
    'mosques.manualLocation': 'Manual location:',
    'mosques.enterAddress': 'Enter your address or city',
    'mosques.back': 'Back',

    // Features Grid
    'features.mosqueFinder': 'Mosque Finder',
    'features.mosqueFinderDesc': 'Find nearby mosques with prayer times and facilities',
    'features.halalFood': 'Halal Food',
    'features.halalFoodDesc': 'Discover halal restaurants and food near you',
    'features.events': 'Islamic Events',
    'features.eventsDesc': 'Stay updated with community events and gatherings',
    'features.community': 'Community',
    'features.communityDesc': 'Connect with Muslims in your area',

    // Language
    'language': 'Language',
  },
  ar: {
    'app.name': 'عبادتنا',
    'app.subtitle': 'عبادتنا',
    'auth.signIn': 'تسجيل الدخول',
    'auth.signOut': 'تسجيل الخروج',
    'auth.welcomeBack': '!مرحباً بعودتك',

    'hero.title': 'ربط العبادة والمجتمع والحياة اليومية',
    'hero.subtitle': 'رفيقك الإسلامي الشامل لأوقات الصلاة واتجاه القبلة والبحث عن المساجد والتواصل المجتمعي.',
    'hero.viewPrayerTimes': 'عرض أوقات الصلاة',
    'hero.findQibla': 'اتجاه القبلة',
    'hero.muslims': 'مسلم',
    'hero.mosques': 'مسجد',
    'hero.accuracy': 'دقة',

    'share.title': 'شارك عبادتنا',
    'share.subtitle': 'ساعد الآخرين في اكتشاف مجتمعنا الإسلامي',

    'features.title': 'استكشف المزيد',
    'features.subtitle': 'اكتشف الطعام الحلال والأحداث الإسلامية وتواصل مع مجتمعك المحلي',

    'social.title': 'تابعنا',
    'social.subtitle': 'ابق على تواصل مع مجتمع عبادتنا',

    'footer.tagline': 'تقوية المجتمع المسلم من خلال التكنولوجيا',
    'footer.privacy': 'سياسة الخصوصية',
    'footer.terms': 'شروط الخدمة',
    'footer.contact': 'اتصل بنا',

    'prayer.title': 'أوقات الصلاة',
    'prayer.next': 'الصلاة التالية:',
    'prayer.in': 'في',
    'prayer.locationUnavailable': 'الموقع غير متاح',
    'prayer.gettingLocation': '...جاري تحديد الموقع',

    'qibla.title': 'اتجاه القبلة',
    'qibla.fromNorth': 'من الشمال',
    'qibla.pointDevice': 'وجه جهازك نحو السهم الذهبي',
    'qibla.calibrate': "حرك هاتفك بشكل '∞' لمعايرة البوصلة",
    'qibla.deviceHeading': 'اتجاه الجهاز:',
    'qibla.enableCompass': 'تفعيل البوصلة',
    'qibla.locationUnavailable': 'الموقع غير متاح',

    'mosques.title': 'البحث عن المساجد',
    'mosques.subtitle': 'اعثر على المساجد القريبة مع أوقات الصلاة والمرافق',
    'mosques.searchRadius': 'نطاق البحث',
    'mosques.openNow': 'مفتوح الآن فقط',
    'mosques.search': 'بحث عن المساجد',
    'mosques.gettingLocation': '...جاري تحديد الموقع',
    'mosques.searching': '...جاري البحث',
    'mosques.found': 'تم العثور على',
    'mosques.noFound': 'لم يتم العثور على مساجد',
    'mosques.noFoundHint': 'حاول زيادة نطاق البحث أو إزالة الفلاتر',
    'mosques.expandSearch': 'توسيع البحث إلى ١٠ كم',
    'mosques.locationNeeded': 'يلزم الوصول إلى الموقع للعثور على المساجد القريبة',
    'mosques.useGPS': 'استخدام GPS',
    'mosques.setManually': 'تحديد يدوياً',
    'mosques.switchToManual': 'التبديل إلى يدوي',
    'mosques.switchToAuto': 'التبديل إلى تلقائي',
    'mosques.autoLocation': 'موقع تلقائي:',
    'mosques.manualLocation': 'موقع يدوي:',
    'mosques.enterAddress': 'أدخل عنوانك أو مدينتك',
    'mosques.back': 'رجوع',

    'features.mosqueFinder': 'البحث عن المساجد',
    'features.mosqueFinderDesc': 'اعثر على المساجد القريبة مع أوقات الصلاة والمرافق',
    'features.halalFood': 'طعام حلال',
    'features.halalFoodDesc': 'اكتشف المطاعم والأطعمة الحلال القريبة منك',
    'features.events': 'الأحداث الإسلامية',
    'features.eventsDesc': 'ابق على اطلاع بأحداث المجتمع والتجمعات',
    'features.community': 'المجتمع',
    'features.communityDesc': 'تواصل مع المسلمين في منطقتك',

    'language': 'اللغة',
  },
  fr: {
    'app.name': 'Ouribadah',
    'app.subtitle': 'Notre Adoration',
    'auth.signIn': 'Se Connecter',
    'auth.signOut': 'Se Déconnecter',
    'auth.welcomeBack': 'Bon retour !',

    'hero.title': 'Relier le Culte, la Communauté et la Vie Quotidienne',
    'hero.subtitle': 'Votre compagnon islamique complet pour les heures de prière, la direction de la Qibla, la recherche de mosquées et la connexion communautaire.',
    'hero.viewPrayerTimes': 'Heures de Prière',
    'hero.findQibla': 'Trouver la Qibla',
    'hero.muslims': 'Musulmans',
    'hero.mosques': 'Mosquées',
    'hero.accuracy': 'Précision',

    'share.title': 'Partager Ouribadah',
    'share.subtitle': 'Aidez les autres à découvrir notre communauté islamique',

    'features.title': 'Explorer Plus de Fonctionnalités',
    'features.subtitle': 'Découvrez la nourriture halal, les événements islamiques et connectez-vous avec votre communauté musulmane locale',

    'social.title': 'Suivez-nous',
    'social.subtitle': 'Restez connecté avec la communauté Ouribadah',

    'footer.tagline': 'Renforcer la communauté musulmane grâce à la technologie',
    'footer.privacy': 'Politique de Confidentialité',
    'footer.terms': 'Conditions d\'Utilisation',
    'footer.contact': 'Contactez-nous',

    'prayer.title': 'Heures de Prière',
    'prayer.next': 'Prochaine prière :',
    'prayer.in': 'dans',
    'prayer.locationUnavailable': 'Localisation indisponible',
    'prayer.gettingLocation': 'Localisation en cours...',

    'qibla.title': 'Direction de la Qibla',
    'qibla.fromNorth': 'du Nord',
    'qibla.pointDevice': 'Orientez votre appareil vers la flèche dorée',
    'qibla.calibrate': "Déplacez votre téléphone en '∞' pour calibrer la boussole",
    'qibla.deviceHeading': 'Cap de l\'appareil :',
    'qibla.enableCompass': 'Activer la Boussole',
    'qibla.locationUnavailable': 'Localisation indisponible',

    'mosques.title': 'Trouver des Mosquées',
    'mosques.subtitle': 'Localisez les mosquées à proximité avec les horaires de prière et les installations',
    'mosques.searchRadius': 'Rayon de Recherche',
    'mosques.openNow': 'Ouvert maintenant',
    'mosques.search': 'Rechercher des Mosquées',
    'mosques.gettingLocation': 'Localisation...',
    'mosques.searching': 'Recherche...',
    'mosques.found': 'Trouvé',
    'mosques.noFound': 'Aucune Mosquée Trouvée',
    'mosques.noFoundHint': 'Essayez d\'augmenter le rayon de recherche ou de supprimer les filtres',
    'mosques.expandSearch': 'Étendre la Recherche à 10 km',
    'mosques.locationNeeded': 'L\'accès à la localisation est nécessaire pour trouver les mosquées à proximité',
    'mosques.useGPS': 'Utiliser le GPS',
    'mosques.setManually': 'Définir Manuellement',
    'mosques.switchToManual': 'Passer en Manuel',
    'mosques.switchToAuto': 'Passer en Auto',
    'mosques.autoLocation': 'Localisation auto :',
    'mosques.manualLocation': 'Localisation manuelle :',
    'mosques.enterAddress': 'Entrez votre adresse ou ville',
    'mosques.back': 'Retour',

    'features.mosqueFinder': 'Trouver des Mosquées',
    'features.mosqueFinderDesc': 'Trouvez les mosquées à proximité avec les horaires et les installations',
    'features.halalFood': 'Nourriture Halal',
    'features.halalFoodDesc': 'Découvrez les restaurants et la nourriture halal près de chez vous',
    'features.events': 'Événements Islamiques',
    'features.eventsDesc': 'Restez informé des événements communautaires et des rassemblements',
    'features.community': 'Communauté',
    'features.communityDesc': 'Connectez-vous avec les musulmans de votre région',

    'language': 'Langue',
  },
};
