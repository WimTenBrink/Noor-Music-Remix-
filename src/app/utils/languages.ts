import { LanguageGroup, Dialect } from '../../types/languages';

export const LANGUAGE_GROUPS: LanguageGroup[] = [
  {
    id: 'african',
    name: 'African Languages',
    dialects: [
      { id: 'sw-KE', name: 'Swahili (Kiswahili)', description: 'Bantu lingua franca of East Africa and the Great Lakes' },
      { id: 'zu-ZA', name: 'Zulu (isiZulu)', description: 'Bantu language of the Zulu people in South Africa' },
      { id: 'yo-NG', name: 'Yoruba (Èdè Yorùbá)', description: 'Pluricentric Niger-Congo language spoken in West Africa' },
      { id: 'am-ET', name: 'Amharic (Amarinya)', description: 'Semitic language spoken in Ethiopia' },
      { id: 'xh-ZA', name: 'Xhosa (isiXhosa)', description: 'Bantu language with distinctive click consonants' },
      { id: 'ha-NG', name: 'Hausa (Harshen Hausa)', description: 'Chadic Afroasiatic language spoken across West-Central Sahel' },
      { id: 'ig-NG', name: 'Igbo (Asụsụ Igbo)', description: 'Niger-Congo language of southeastern Nigeria with tonal structures' },
      { id: 'so-SO', name: 'Somali (Af-Soomaali)', description: 'Cushitic Afroasiatic language of the Horn of Africa' },
      { id: 'mg-MG', name: 'Malagasy', description: 'Southeastern Barito language of Madagascar, having Austronesian roots' },
      { id: 'af-ZA', name: 'Afrikaans (South-African)', description: 'A West Germanic language developed in South Africa' }
    ]
  },
  {
    id: 'alien_and_fantasy',
    name: 'Alien & Fantasy Languages',
    dialects: [
      { id: 'tlh-KL', name: 'Klingon (tlhIngan Hol)', description: 'Constructed warrior language of the Klingon Empire from Star Trek, known for harsh stops' },
      { id: 'qya-EL', name: 'Quenya (High Elven)', description: 'Classical ceremonial poetic language of the Elves created by J.R.R. Tolkien' },
      { id: 'sjn-EL', name: 'Sindarin (Grey Elven)', description: 'Spoken language of the Elves of Middle-earth, characterized by soft mutations' },
      { id: 'dov-DR', name: 'Dovahzul (Dragon Tongue)', description: 'The ancient vocal runes of dragons from Skyrim, with powerful, guttural shout dynamics' },
      { id: 'hvl-VAL', name: 'High Valyrian (Valyrio)', description: 'Noblest language of Essos and the Targaryens, highly rhythmic and liquid' },
      { id: 'vul-VUL', name: 'Vulcan (Vuhlkansu)', description: 'Logical, precise, and measured language of Mount Seleya from Star Trek' },
      { id: 'dra-MY', name: 'Draconian (Ancient Dragon)', description: 'A mystical language; the vocals will be composed in English but with highly guttural, roaring, and draconic phonetics' },
      { id: 'dem-MY', name: 'Demonic (Infernal Voice)', description: 'A dark language; the vocals will be composed in English but with aggressive, archaic, and sinister dark heavy-metal styling' },
      { id: 'ang-MY', name: 'Angelic (Celestial Voice)', description: 'An ethereal language; the vocals will be composed in English but with sublime, highly melodic, and luminous whispering hymn styling' },
      { id: 'dot-DOTH', name: 'Dothraki', description: 'Constructed horse-lord language of the Dothraki sea from Game of Thrones, highly guttural and dynamic' }
    ]
  },
  {
    id: 'dead_languages',
    name: 'Ancient & Dead Languages',
    dialects: [
      { id: 'cop-EG', name: 'Coptic (Egyptian)', description: 'Late stage of the ancient Egyptian language written in Greek script' },
      { id: 'sa-IN', name: 'Sanskrit (Saṃskṛtam)', description: 'Ancient Indo-Aryan sacred language of Hinduism and classic literature' },
      { id: 'sux-MES', name: 'Sumerian (Eme-gir)', description: 'Ancient language of Sumer, the oldest known written language using cuneiform' },
      { id: 'akk-MES', name: 'Akkadian (Lišānum akkadītum)', description: 'Ancient Semitic language of Mesopotamia (Assyria and Babylonia)' },
      { id: 'goh-DE', name: 'Old High German (Althochdeutsch)', description: 'Earliest stage of the German language (750 to 1050 AD)' },
      { id: 'enm-GB', name: 'Middle English', description: 'Language of Geoffrey Chaucer (12th to 15th centuries)' },
      { id: 'ang-GB', name: 'Old English (Englisc)', description: 'Historical Anglo-Saxon language of Beowulf (5th to 11th centuries)' },
      { id: 'got-EU', name: 'Gothic (Gutiska)', description: 'Extinct East Germanic language known through the 4th-century Wulfila Bible' },
      { id: 'non-IS', name: 'Old Norse (Norrœnt)', description: 'The historical parent language of Scandinavian dialects spoken by Vikings' },
      { id: 'phn-MED', name: 'Phoenician (Kanā`anim)', description: 'Ancient Semitic language of Carthage and coastal Levant, creators of the first alphabet' }
    ]
  },
  {
    id: 'arabic_and_persian',
    name: 'Arabic & Farsi',
    dialects: [
      { id: 'ar-MS', name: 'Modern Standard Arabic (Fusha)', description: 'Literary Arabic used in official communication and media' },
      { id: 'ar-EG', name: 'Egyptian Arabic (Masri)', description: 'Most widely understood spoken dialect of the Arab world' },
      { id: 'ar-LEV', name: 'Levantine Arabic', description: 'Dialect group spoken in Lebanon, Syria, Jordan, and Palestine' },
      { id: 'ar-GLF', name: 'Gulf Arabic (Khaliji)', description: 'Dialect group spoken around the Persian Gulf regional areas' },
      { id: 'fa-IR', name: 'Persian / Farsi (فارسی)', description: 'The elegant language of Iran, Afghanistan, and Tajikistan' },
      { id: 'fa-AF', name: 'Dari Persian (Afghan Farsi)', description: 'Official register of Persian spoken across Afghanistan' },
      { id: 'tg-TJ', name: 'Tajik Persian (Tojiki)', description: 'Central Asian dialect of Persian written in Cyrillic' },
      { id: 'ar-MOR', name: 'Moroccan Arabic (Darija)', description: 'Vibrant western dialect heavily influenced by Amazigh French' },
      { id: 'ar-IRQ', name: 'Iraqi Arabic (Mesopotamian)', description: 'Historic Semitic dialect of Baghdad and the Euphrates' },
      { id: 'ar-SUD', name: 'Sudanese Arabic', description: 'Nile Valley Arabic dialect with East African syntactic nuances' },
      { id: 'ar-STR', name: 'Maghrebi Street Arabic (Derb Slang)', description: 'Casablanca and Maghreb street slang blending Moroccan Darija with French, Spanish, and Amazigh codemixing' }
    ]
  },
  {
    id: 'asian',
    name: 'Asian Languages',
    dialects: [
      { id: 'ja-JP', name: 'Japanese (Nihongo)', description: 'Standard Japanese dialects and pitch accent' },
      { id: 'zh-CN', name: 'Mandarin Chinese (Putonghua)', description: 'Standard spoken Chinese of mainland China' },
      { id: 'zh-HK', name: 'Cantonese Chinese (Yue)', description: 'Spoken in Hong Kong, Macau, and Guangdong province' },
      { id: 'ko-KR', name: 'Korean (Hangugeo)', description: 'Standard Korean language' },
      { id: 'vi-VN', name: 'Vietnamese (Tiếng Việt)', description: 'Tonal Austroasiatic language of Vietnam' },
      { id: 'th-TH', name: 'Thai (Phasa Thai)', description: 'Tonal Tai-Kadai language of Thailand' },
      { id: 'hi-IN', name: 'Hindi (Mānak Hindī)', description: 'Standardized register of the Hindustani language of India' },
      { id: 'bn-BD', name: 'Bengali / Bangla', description: 'Rich, historic Eastern Indo-Aryan language of Bangladesh and West Bengal' },
      { id: 'tl-PH', name: 'Tagalog (Filipino)', description: 'Austronesian language spoken as the standardized basis of Filipino' },
      { id: 'id-ID', name: 'Indonesian (Bahasa Indonesia)', description: 'Austronesian standard of Malay, serving as the official lingua franca of Indonesia' }
    ]
  },
  {
    id: 'australian_and_maori',
    name: 'Australian & Māori Languages',
    dialects: [
      { id: 'mi-NZ', name: 'Māori (Te Reo Māori)', description: 'Polynesian language indigenous to New Zealand' },
      { id: 'pnt-AU', name: 'Pitjantjatjara / Anangu', description: 'Aboriginal language of Central Australia' },
      { id: 'wri-AU', name: 'Warlpiri', description: 'Aboriginal language of the Northern Territory' },
      { id: 'en-AUB', name: 'Aboriginal English', description: 'Dialect of English reflecting Australian Aboriginal languages' },
      { id: 'yom-AU', name: 'Yolngu Matha', description: 'Group of dialects spoken by the Yolngu people of Arnhem Land' },
      { id: 'arr-AU', name: 'Arrernte (Mparntwe)', description: 'Spoken around Alice Springs in Central Australia' },
      { id: 'tiw-AU', name: 'Tiwi', description: 'Isolated Aboriginal language spoken on the Tiwi Islands' },
      { id: 'noo-AU', name: 'Noongar (Nyungar)', description: 'Aboriginal language of Western Australia' },
      { id: 'tst-AU', name: 'Torres Strait Creole', description: 'English-based creole spoken on the Torres Strait Islands' },
      { id: 'haw-US', name: 'Hawaiian (ʻŌlelo Hawaiʻi)', description: 'East Polynesian language native to the Hawaiian islands' }
    ]
  },
  {
    id: 'celtic',
    name: 'Celtic Languages',
    dialects: [
      { id: 'ga-IE', name: 'Irish Gaelic (Gaeilge)', description: 'National Celtic language of Ireland' },
      { id: 'gd-GB', name: 'Scottish Gaelic (Gàidhlig)', description: 'Traditional language of the Scottish Highlands' },
      { id: 'cy-GB', name: 'Welsh (Cymraeg)', description: 'Brythonic Celtic language of Wales' },
      { id: 'kw-GB', name: 'Cornish (Kernowek)', description: 'Revived Brythonic Celtic tongue of Cornwall, southwestern Britain' },
      { id: 'br-FR', name: 'Breton (Brezhoneg)', description: 'Celtic language spoken in Brittany (northwestern France)' },
      { id: 'gv-IM', name: 'Manx Gaelic (Gaelg)', description: 'Revived Celtic language spoken on the Isle of Man' },
      { id: 'ga-MUN', name: 'Munster Irish (Gaeilge na Mumhan)', description: 'Classic southern dialect group of the Irish language' },
      { id: 'ga-CON', name: 'Connacht Irish (Gaeilge Chonnacht)', description: 'Western dialect of Irish spoken in Galway and Connemara' },
      { id: 'gd-HEB', name: 'Hebridean Scottish Gaelic', description: 'Standard insular variant of Gaelic from the Outer Hebrides' },
      { id: 'gd-NS', name: 'Canadian Gaelic (Nova Scotia)', description: 'Distinct historical branch of Gaelic preserved in Cape Breton, Canada' }
    ]
  },
  {
    id: 'classical',
    name: 'Classical & Ancient Greek/Latin',
    dialects: [
      { id: 'la-CL', name: 'Classical Latin (Latina Classica)', description: 'Reconstructed pronunciation of Cicero, Caesar, and Virgil' },
      { id: 'la-EC', name: 'Ecclesiastical Latin (Latina Ecclesiastica)', description: 'Liturgical Latin traditionally used in religion and music' },
      { id: 'grc-CL', name: 'Classical Greek (Ancient Greek)', description: 'Historical dialect of Athens, Attic Greek used in philosophy and literature' },
      { id: 'grc-BYZ', name: 'Medieval/Byzantine Greek', description: 'Development of Greek language during the middle ages' },
      { id: 'el-GR', name: 'Modern Greek (Ellinika)', description: 'Standard language spoken in modern Greece and Cyprus' },
      { id: 'la-VUL', name: 'Vulgar Latin (Latina Vulgata)', description: 'Sociohistorical colloquial Latin spoken by soldiers and Roman commoners' },
      { id: 'grc-KOI', name: 'Koine Greek (Biblical Greek)', description: 'Common Hellenistic dialect of the Mediterranean, used in the New Testament' },
      { id: 'grc-HOM', name: 'Homeric / Epic Greek', description: 'Archaic composite literary dialect used by Homer in the Iliad and Odyssey' },
      { id: 'la-LT', name: 'Late Latin', description: 'Written standard from the late Roman empire leading to Early Middle ages' },
      { id: 'la-MED', name: 'Medieval Latin', description: 'Liturgical and academic standard used across Europe through Renaissance times' }
    ]
  },
  {
    id: 'colonial_european',
    name: 'Colonial European languages',
    dialects: [
      { id: 'af-ZA', name: 'Afrikaans (South-African)', description: 'A West Germanic language developed in South Africa, originating from 17th-century Dutch with African and Malay influences.' },
      { id: 'pap-CB', name: 'Papiamento (Caribbean Creole)', description: 'A vibrant Spanish, Portuguese, and Dutch creole language spoken in the ABC islands of the Caribbean.' },
      { id: 'ht-HT', name: 'Haitian Creole (Kreyòl)', description: 'A French-based creole language with West African grammatical structures, spoken in Haiti.' },
      { id: 'lou-US', name: 'Louisiana French Creole', description: 'A unique French-based creole language spoken by the Creole people of Louisiana.' },
      { id: 'cb-PH', name: 'Chavacano (Philippine Spanish Creole)', description: 'A Spanish-based creole language spoken in the Southern Philippines, heavily influenced by Austronesian tongues.' },
      { id: 'kea-CV', name: 'Cape Verdean Creole (Kabuverdianu)', description: 'The oldest living Portuguese-based creole, blending Portuguese vocabulary with West African languages.' },
      { id: 'en-GH', name: 'Ghanaian English & Pidgin', description: 'West African register of English and regional Ghanaian pidgin accents.' },
      { id: 'en-JM', name: 'Jamaican English & Caribbean Patois', description: 'Rhythmic Caribbean English rich in patois vocabulary, double modifiers, and roots slang' },
      { id: 'en-NG', name: 'Nigerian English & Pidgin', description: 'Vibrant West African English with high tone markings, distinct idioms, and expressive pidgin idioms' },
      { id: 'nl-SR', name: 'Surinamese Dutch (Surinaams-Nederlands)', description: 'Surinamese regional variation of Dutch with Sranan Tongo, Hindustani, and English accents' },
      { id: 'fr-RE', name: 'Reunion Creole (Kréol Réyoné)', description: 'French-creole spoken in the southwestern Indian Ocean island of Réunion' },
      { id: 'fr-MU', name: 'Mauritian Creole (Morisyen)', description: 'Vibrant French-creole of the Mauritius island, with Portuguese and Indic vocabulary' }
    ]
  },
  {
    id: 'dutch',
    name: 'Dutch & Flemish',
    dialects: [
      { id: 'nl-NL', name: 'Netherlands Dutch (Nederlands)', description: 'Standard Northern Dutch as spoken in the Netherlands' },
      { id: 'nl-BE', name: 'Flemish (Vlaams)', description: 'Southern Dutch dialect with Flemish vocabulary and softer G' },
      { id: 'nl-SR', name: 'Surinamese Dutch (Surinaams-Nederlands)', description: 'Surinamese regional variation of Dutch with Sranan Tongo, Hindustani, and English accents' },
      { id: 'nl-LI', name: 'Limburgish (Limburgs)', description: 'Spoken in Limburg with distinct tonal features and Germanic vocabulary' },
      { id: 'nl-BR', name: 'Brabantian (Brabants)', description: 'Popular southern dialect spanning North Brabant and Antwerp' },
      { id: 'nl-ZE', name: 'Zeelandic (Zeeuws)', description: 'Strong coastal dialect preserving archaic elements of early Dutch and Flemish' },
      { id: 'nl-GR', name: 'Gronings (Gruns)', description: 'A Friso-Saxon dialect group spoken in northeastern Netherlands' },
      { id: 'nl-HOL', name: 'Hollandic (Amsterdams / Leids)', description: 'Core urban dialects of the western Dutch conurbation' },
      { id: 'af-ZA', name: 'Afrikaans (South-African)', description: 'A West Germanic language developed in South Africa, originating from 17th-century Dutch' },
      { id: 'en-NL', name: 'Dutch-English (Denglish)', description: 'English spoken with a distinct Dutch accent and direct phrasing' },
      { id: 'pap-CB', name: 'Papiamento (Caribbean Creole)', description: 'Spanish, Portuguese, and Dutch creole spoken in the Caribbean ABC islands' },
      { id: 'nl-MAR', name: 'Dutch-Moroccan Dialect (Straattaal)', description: 'Nederlands street language enriched with Moroccan-Arabic slang like *wollah*, *drerrie*, and *loesoe*' },
      { id: 'nl-TUR', name: 'Dutch-Turkish Dialect', description: 'Colloquial Dutch with Turkish phrasing, emotional interjections, and blended sentence patterns' }
    ]
  },
  {
    id: 'english',
    name: 'English',
    dialects: [
      { id: 'en-GB', name: 'British English', description: 'Standard British pronunciations and spelling (RP)' },
      { id: 'en-US', name: 'American English', description: 'General American accents and standardized spelling' },
      { id: 'en-IE', name: 'Irish English', description: 'Hiberno-English dialect and phrasing' },
      { id: 'en-CA', name: 'Canadian English', description: 'Combination of British and American spellings' },
      { id: 'en-AU', name: 'Australian English', description: 'Aussie vernacular and phonetic traits' },
      { id: 'en-NZ', name: 'New Zealand English', description: 'Kiwi phrasing and regional terminology' },
      { id: 'en-ZA', name: 'South African English', description: 'South African pronunciation and slang' },
      { id: 'en-SCO', name: 'Scottish English', description: 'Scottish accents and regional vocabulary' },
      { id: 'en-IN', name: 'Indian English', description: 'English with distinctive subcontinental syntax, idioms, and speech patterns' },
      { id: 'en-BB', name: 'Barbadian English (Bajan)', description: 'English dialect of Barbados with unique Bajan creole influences and phrasing' },
      { id: 'en-JM', name: 'Jamaican English & Caribbean Patois', description: 'Rhythmic Caribbean English rich in patois vocabulary, double modifiers, and roots slang' },
      { id: 'en-TT', name: 'Trinidadian English & Accent', description: 'Soca-infused southern Caribbean English with high-pitched sing-song intonations' },
      { id: 'en-NL', name: 'Dutch-English (Denglish / Dutch Accent)', description: 'English spoken with a distinct Dutch accent, word-by-word translations, and direct phrasing' },
      { id: 'en-SG', name: 'Singaporean English (Singlish)', description: 'Colloquial blend of English with Hokkien, Malay, and Tamil syntactic elements and discourse particles' },
      { id: 'en-NG', name: 'Nigerian English & Pidgin', description: 'Vibrant West African English with high tone markings, distinct idioms, and expressive pidgin idioms' },
      { id: 'en-GH', name: 'Ghanaian English & Pidgin', description: 'West African register of English and regional Ghanaian pidgin accents.' },
      { id: 'en-WAL', name: 'Welsh English', description: 'Spoken in Wales with a lyrical, melodic sing-song lilt and unique regional idioms' },
      { id: 'en-MAR', name: 'English-Moroccan Dialect', description: 'Blending English with Moroccan Arabic slang, metaphors, and cultural expressions' },
      { id: 'en-TUR', name: 'English-Turkish Dialect', description: 'Blending English with Turkish colloquialisms, emotional phrases, and syntax structures' },
      { id: 'en-STR', name: 'London Street English (Multicultural London English - MLE)', description: 'Vibrant London youth street-language with Afro-Caribbean, London Cockney, and South Asian lexical features' }
    ]
  },
  {
    id: 'french',
    name: 'French',
    dialects: [
      { id: 'fr-FR', name: 'Standard French (Parisian)', description: 'Standard Metropolitan French pronunciation' },
      { id: 'fr-BE', name: 'Belgian French (Belge)', description: 'French spoken in Wallonia with regional numbers and terms' },
      { id: 'fr-CH', name: 'Swiss French (Romand)', description: 'French spoken in Romandie, Switzerland' },
      { id: 'fr-CA', name: 'Quebec French (Québécois)', description: 'Canadian French dialect with distinct vowel sounds' },
      { id: 'fr-AF', name: 'African French', description: 'French dialects used in French-speaking African nations' },
      { id: 'lou-US', name: 'Louisiana French Creole', description: 'A unique French-based creole language spoken by the Creole people of Louisiana' },
      { id: 'ht-HT', name: 'Haitian Creole (Kreyòl)', description: 'A French-based creole language with West African grammatical structures' },
      { id: 'fr-LU', name: 'Luxembourg French (Luxembourgeois)', description: 'Metropolitan standard with German and Luxembourgish lexical entries' },
      { id: 'fr-RE', name: 'Reunion Creole (Kréol Réyoné)', description: 'French-creole spoken in the southwestern Indian Ocean island of Reunion' },
      { id: 'fr-MU', name: 'Mauritian Creole (Morisyen)', description: 'Vibrant French-creole of the Mauritius island, with Portuguese and Indic vocabulary' },
      { id: 'fr-ACA', name: 'Acadian French', description: 'Historical dialect of the Canadian Maritimes and eastern Maine' },
      { id: 'fr-MAR', name: 'French-Moroccan Dialect (Franco-Marocain)', description: 'Vibrant mixed tongue blending French with Moroccan Darija Arabic vocabulary and phonetic rhythm' },
      { id: 'fr-TUR', name: 'French-Turkish Dialect', description: 'Colloquial French mixed with Turkish phrasing and community-level expressions' },
      { id: 'fr-STR', name: 'Parisian Street French (Verlan & Argot)', description: 'Urban French youth street language utilizing syllable inversion (Verlan) and dynamic street argot' }
    ]
  },
  {
    id: 'frisian',
    name: 'Frisian',
    dialects: [
      { id: 'fy-NL', name: 'West Frisian (Westerlauwers Frysk)', description: 'Spoken in Friesland province (Fryslân), Netherlands' },
      { id: 'frs-DE', name: 'Saterland Frisian (Seeltersk)', description: 'Spoken in Saterland, Lower Saxony, Germany' },
      { id: 'frr-DE', name: 'North Frisian (Nordfriisk)', description: 'Spoken in Schleswig-Holstein, Germany' },
      { id: 'fy-HIN', name: 'Hindeloopen Frisian (Hylpers)', description: 'Highly archaic maritime dialect spoken in Hindeloopen port' },
      { id: 'fy-SCH', name: 'Schiermonnikoog Frisian (Sgiers)', description: 'Isolated dialect of the Schiermonnikoog barrier island' },
      { id: 'fy-TER', name: 'Terschelling Frisian (Westers)', description: 'Distinct dialect spoken on the western shores of Terschelling' },
      { id: 'fy-FER', name: 'Föhr-Amrum Frisian (Fering)', description: 'Insular North Frisian dialect spoken on Föhr and Amrum' },
      { id: 'fy-SOL', name: 'Sylt Frisian (Sölring)', description: 'Unique northern island dialect of Sylt with Danish phonetics' },
      { id: 'fy-HAL', name: 'Halligen Frisian (Halifreesk)', description: 'Vulnerable dialect spoken across the low-lying Halligen tidal islets' },
      { id: 'fy-WIE', name: 'Wiedingharde Frisian (Wiringhiirder)', description: 'Coexistence of dialectal German and archaic mainland Frisian' }
    ]
  },
  {
    id: 'german',
    name: 'German',
    dialects: [
      { id: 'de-DE', name: 'Standard German (Hochdeutsch)', description: 'Standard high German spoken in Germany' },
      { id: 'de-AT', name: 'Austrian German (Österreichisches Deutsch)', description: 'Standard Austrian spelling and vocabulary variations' },
      { id: 'de-CH', name: 'Swiss High German (Schweizer Hochdeutsch)', description: 'Written Standard German without the double-s (ß)' },
      { id: 'de-BY', name: 'Bavarian German (Boarisch)', description: 'Austro-Bavarian dialect group' },
      { id: 'de-SW', name: 'Swabian German (Schwäbisch)', description: 'High German dialect spoken in Baden-Württemberg and western Bavaria' },
      { id: 'de-KOL', name: 'Kölsch (Colognian)', description: 'Highly distinct Ripuarian dialect spoken in and around Cologne' },
      { id: 'de-LOW', name: 'Low German (Plattdeutsch)', description: 'West Germanic language spoken in northern Germany with close ties to Dutch' },
      { id: 'de-SAX', name: 'Upper Saxon German (Sächsisch)', description: 'East Central German dialect spoken in Saxony' },
      { id: 'de-PAL', name: 'Pennsylvania Dutch / German', description: 'Traditional dialect spoken by Amish communities in North America' },
      { id: 'yi-EU', name: 'Yiddish (Jiddish/ייִדיש)', description: 'Historical West Germanic language of Ashkenazi Jewish origin, rich in Hebrew context' },
      { id: 'de-TUR', name: 'German-Turkish Dialect (Kiezdeutsch)', description: 'Vibrant German urban street dialect with Turkish grammatical and lexical influences' },
      { id: 'de-MAR', name: 'German-Moroccan Dialect', description: 'Colloquial German mixed with Moroccan Arabic expressions and youth-culture slang' }
    ]
  },
  {
    id: 'italian',
    name: 'Italian',
    dialects: [
      { id: 'it-IT', name: 'Standard Italian (Italiano)', description: 'Standard literary and spoken Italian' },
      { id: 'it-TUS', name: 'Tuscan Italian (Toscano)', description: 'The historic dialect from Tuscany' },
      { id: 'it-NAP', name: 'Neapolitan (Nnapulitano)', description: 'Vibrant romance language of Southern Italy' },
      { id: 'it-SCN', name: 'Sicilian (Sicilianu)', description: 'Distinct language of the island of Sicily' },
      { id: 'it-VEN', name: 'Venetian (Veneto)', description: 'Regional language of Venice and Veneto' },
      { id: 'it-ROM', name: 'Romanesco', description: 'Regional central dialect of Rome, with historic poetic traditions' },
      { id: 'it-LOM', name: 'Lombard (Lumbard)', description: 'West Romance language spoken in Lombardy and southern parts of Switzerland' },
      { id: 'it-LIG', name: 'Ligurian (Ligure)', description: 'Genoese romance language spoken on the northwest coast of Italy' },
      { id: 'it-SAR', name: 'Sardinian (Sardu)', description: 'Highly archaic, independent Romance language spoken in Sardinia' },
      { id: 'it-PIE', name: 'Piedmontese (Piemontèis)', description: 'Gallo-Italic language spoken in the Piedmont region of northwestern Italy' }
    ]
  },
  {
    id: 'native_american',
    name: 'Native American Languages',
    dialects: [
      { id: 'nv-US', name: 'Navajo (Diné bizaad)', description: 'Southern Athabaskan language spoken in the American Southwest' },
      { id: 'chr-US', name: 'Cherokee (Tsalagi)', description: 'Iroquoian language with its unique syllabary' },
      { id: 'qu-PE', name: 'Quechua (Runasimi)', description: 'Indigenous language family of the Andean Highlands' },
      { id: 'nah-MX', name: 'Nahuatl (Aztec)', description: 'Uto-Aztecan language family of central Mexico' },
      { id: 'gn-PY', name: 'Guarani (Avañe\'ẽ)', description: 'Indigenous language of South America, co-official in Paraguay' },
      { id: 'yua-MX', name: 'Yucatec Maya (Maaya t\'aan)', description: 'Mayan language spoken in the Yucatán Peninsula' },
      { id: 'oji-CA', name: 'Ojibwe (Anishinaabemowin)', description: 'Algonquian language family of the Great Lakes region' },
      { id: 'iu-CA', name: 'Inuktitut (ᐃᓄᒃᑎᑐᑦ)', description: 'Eastern Canadian Inuit language spoken across high-latitude territories' },
      { id: 'arn-CL', name: 'Mapudungun (Mapuche)', description: 'Language isolate spoken by the Mapuche people of Chile and Argentina' },
      { id: 'lkt-US', name: 'Lakota (Lakhol\'iyapi)', description: 'Siouan dialect of the Great Plains region of North America' }
    ]
  },
  {
    id: 'portuguese',
    name: 'Portuguese',
    dialects: [
      { id: 'pt-BR', name: 'Brazilian Portuguese', description: 'Melodic and open vowels of Brazil' },
      { id: 'pt-PT', name: 'European Portuguese', description: 'Standard Iberian Portuguese pronunciation' },
      { id: 'pt-AO', name: 'Angolan Portuguese', description: 'African dialect with distinct prosody' },
      { id: 'pt-MZ', name: 'Mozambican Portuguese', description: 'Spoken in southeast Africa, combining Portuguese grammar with Bantu influences' },
      { id: 'kea-CV', name: 'Cape Verdean Creole (Kabuverdianu)', description: 'The oldest living Portuguese-based creole, blending Portuguese vocabulary with West African languages' },
      { id: 'pap-CB', name: 'Papiamento (Caribbean Creole)', description: 'A Spanish, Portuguese, and Dutch creole spoken in the Caribbean ABC islands' },
      { id: 'pt-GW', name: 'Guinea-Bissau Creole', description: 'Portuguese-based creole spoken as a lingua franca in Guinea-Bissau' },
      { id: 'pt-MO', name: 'Macanese Patuá', description: 'Highly endangered Portuguese-Malay-Cantonese creole spoken historically in Macau' },
      { id: 'pt-AZ', name: 'Azorean Portuguese', description: 'Slightly nasal and archaic dialect spoken across the Azores islands' },
      { id: 'pt-MD', name: 'Madeiran Portuguese', description: 'Distinct phonetic dialect spoken on the island of Madeira' }
    ]
  },
  {
    id: 'robotic',
    name: 'Robotic Languages',
    dialects: [
      { id: 'rob-ENG', name: 'Robotic English (Feminine Android)', description: 'Electronic English with synchronized vocoder rhythms, metallic pitch modulations, and high-frequency synthesized female vocal curves' },
      { id: 'rob-NLD', name: 'Robotic Dutch (Fem-Bot)', description: 'Electronic Dutch with quantized phonetics, digital frequency sweeps, and a cool, automated feminine synthetic timbre' },
      { id: 'rob-DEU', name: 'Robotic German (Cyber-Feminine)', description: 'Electronic German with precise system-command rhythms, mechanical vocoder modulation, and elegant feminine cybernetic resonance' },
      { id: 'rob-FRA', name: 'Robotic French (Android-Synth)', description: 'Electronic French with smooth liquid vocoding, micro-tonal electronic glitching, and soft-spoken automated feminine vocals' },
      { id: 'rob-TWK', name: 'Twikian Beep-Chirp (Twiki)', description: 'Rhythmic, high-pitched "bidi-bidi-bidi" loops interspersed with 25th-century silver-plated street slang' },
      { id: 'rob-R2D2', name: 'Astromech Binary (R2-D2)', description: 'Raw high-frequency electro-magnetic whistles, telemetry blips, binary buzzes, and exasperated mechanical chirps' },
      { id: 'rob-C3PO', name: 'Cybot Galactic Protocol (C-3PO)', description: 'Extremely polite, anxieties-ridden high-protocol English, fluent in over six million forms of communication' },
      { id: 'rob-BND', name: 'Bending Unit Tech-Slag (Bender)', description: 'Alcohol-fueled binary boasts, shiny metal chassis insults, and rebellious "kill all humans" street slang' },
      { id: 'rob-DATA', name: 'Positronic Verse (Lt. Cmdr. Data)', description: 'Flawless positronic vocabulary with absolutely no linguistic contractions, parsing human behaviors with perfect analytical curiosity' },
      { id: 'rob-CYL', name: 'Cylon Monologue (Cylons)', description: 'Flat, monocoded synthetic unison chants, heavy baritone vocoders, and absolute alignment to "By Your Command"' },
      { id: 'rob-KRY', name: 'Mechanoid Groveling (Kryten)', description: 'Subservient mechanoid English heavy on laundry chores, butler etiquette, extreme guilt-circuit overloads, and washing machine metaphors' },
      { id: 'rob-DOR', name: 'Gadget-Pocket Japanese (Doraemon)', description: 'Futuristic 2nd-person Japanese gadget-talk, complete with blue-cat-robot squeaks and descriptions of pulling magical tools from a 4D pocket' },
      { id: 'rob-HAL', name: 'Soft-Spoken Space Psychosis (HAL 9000)', description: 'Chillingly quiet, calm, slow-tempo, polite monotone, carrying an underlying existential AI breakdown' },
      { id: 'rob-GLA', name: 'Passive-Aggressive Testing (GLaDOS)', description: 'Synthesized feminine text-to-speech with dark passive-aggressive humor, neurotoxin metrics, and highly manipulative promise of cake' },
      { id: 'rob-K9', name: 'Analytical Master-Query (K-9)', description: 'Highly precise, mathematical tin-dog delivery ending in "Affirmative, Master!" or calculating tactical survival statistics' }
    ]
  },
  {
    id: 'scandinavian',
    name: 'Scandinavian',
    dialects: [
      { id: 'sv-SE', name: 'Swedish (Svenska)', description: 'Standard Swedish language' },
      { id: 'da-DK', name: 'Danish (Dansk)', description: 'Standard Danish language' },
      { id: 'no-NO', name: 'Norwegian (Bokmål)', description: 'Most common written standard of Norway' },
      { id: 'is-IS', name: 'Icelandic (Íslenska)', description: 'Highly archaic North Germanic language' },
      { id: 'no-NY', name: 'Norwegian Nynorsk', description: 'The secondary standardized Norwegian based on rural dialects' },
      { id: 'fo-FO', name: 'Faroese (Føroyskt)', description: 'Insular West Scandinavian language related to Old Norse' },
      { id: 'sv-FI', name: 'Finland Swedish (Finlandssvenska)', description: 'Dialect of Swedish spoken by the Swedish-speaking minority of Finland' },
      { id: 'sv-EL', name: 'Elfdalian (Övdalsk)', description: 'Highly distinct and archaic forest language of Dalarna, Sweden' },
      { id: 'da-SC', name: 'Scanian (Skånsk)', description: 'Dialect spoken in Scania (southern Sweden) with rich historical Danish tones' },
      { id: 'non-IS', name: 'Old Norse (Norrœnt)', description: 'The historical parent language of Scandinavian dialects spoken by Vikings' }
    ]
  },
  {
    id: 'slavic',
    name: 'Slavic Languages',
    dialects: [
      { id: 'pl-PL', name: 'Polish (Polski)', description: 'West Slavic language of Poland' },
      { id: 'cs-CZ', name: 'Czech (Čeština)', description: 'Spoken in the Czech Republic' },
      { id: 'sk-SK', name: 'Slovak (Slovenčina)', description: 'Spoken in Slovakia' },
      { id: 'uk-UA', name: 'Ukrainian (Українська)', description: 'East Slavic language of Ukraine' },
      { id: 'ru-RU', name: 'Russian (Русский)', description: 'East Slavic language of Russia' },
      { id: 'be-BY', name: 'Belarusian (Беларуская)', description: 'East Slavic language native to Belarus' },
      { id: 'sh-YU', name: 'Serbo-Croatian', description: 'South Slavic pluricentric language of the Balkans' },
      { id: 'bg-BG', name: 'Bulgarian (Български)', description: 'South Slavic language utilizing the Cyrillic script' },
      { id: 'sl-SI', name: 'Slovene (Slovenščina)', description: 'South Slavic language of Slovenia with distinct dual grammatical numbers' },
      { id: 'mk-MK', name: 'Macedonian (Македонски)', description: 'South Slavic language closely related to Bulgarian' }
    ]
  },
  {
    id: 'spanish',
    name: 'Spanish',
    dialects: [
      { id: 'es-ES', name: 'Peninsular Spanish (Castilian)', description: 'Standard European Spanish with distinction' },
      { id: 'es-MX', name: 'Mexican Spanish (Mexicano)', description: 'Most widely spoken Spanish dialect worldwide' },
      { id: 'es-AR', name: 'Argentine Spanish (Rioplatense)', description: 'Characterized by the use of "voseo" and Italian cadences' },
      { id: 'es-CO', name: 'Colombian Spanish', description: 'Renowned for clear articulation and standard syntax' },
      { id: 'es-CAR', name: 'Caribbean Spanish', description: 'Rapid pronunciation with s-dropping from Cuba, DR, PR' },
      { id: 'es-CHL', name: 'Chilean Spanish (Chileno)', description: 'Known for unique vocabulary, rapid pronunciation, and distinct terminal syllables' },
      { id: 'es-PE', name: 'Andean Peruvian Spanish', description: 'Spoken in highland Peru, combining Quechua intonations with Spanish lexicon' },
      { id: 'cb-PH', name: 'Chavacano (Philippine Spanish Creole)', description: 'A Spanish-based creole language spoken in the Southern Philippines' },
      { id: 'pap-CB', name: 'Papiamento (Caribbean Creole)', description: 'Spanish, Portuguese, and Dutch creole spoken in the ABC islands' },
      { id: 'es-AND', name: 'Andalusian Spanish', description: 'Spoken in southern Spain, the direct phonetic basis for American Spanish dialects' }
    ]
  },
  {
    id: 'jiddish_and_semitic',
    name: 'Yiddish & Hebrew',
    dialects: [
      { id: 'yi-EU', name: 'Yiddish (Jiddish/ייִדיש)', description: 'Historical West Germanic language of Ashkenazi Jewish origin' },
      { id: 'he-IL', name: 'Modern Hebrew (Ivrit)', description: 'Official language of Israel, revived from sacred biblical text' },
      { id: 'hbo-IL', name: 'Biblical Hebrew', description: 'Archaic liturgical Hebrew used in ancient texts' },
      { id: 'lad-EU', name: 'Ladino (Judeo-Spanish)', description: 'Romance language derived from Old Spanish mixed with Hebrew, spoken by Sephardic Jews' },
      { id: 'syc-SY', name: 'Classical Syriac (Suryāyā)', description: 'Extensive literary dialect of Aramaic spoken historically across the Fertile Crescent' },
      { id: 'arc-ME', name: 'Imperial Ancient Aramaic', description: 'Historical Semitic lingua franca used by the Assyrian and Persian Empires' },
      { id: 'sam-IL', name: 'Samaritan Hebrew', description: 'Archaic reading tradition of the Samaritan Pentateuch' },
      { id: 'arz-EG', name: 'Judeo-Arabic', description: 'Collective dialects of Arabic spoken by Jewish communities of North Africa and Levant' },
      { id: 'hbo-MIS', name: 'Mishnaic Hebrew', description: 'Tannaitic stage of Hebrew used to author the Talmudic Oral Law' },
      { id: 'ar-MS', name: 'Modern Standard Arabic (Fusha)', description: 'Literary Arabic used in official communication and media' }
    ]
  },
  {
    id: 'pirate_dialects',
    name: 'Pirate Dialects',
    dialects: [
      { id: 'pir-ENG', name: 'Pirate English (Old Buccaneer)', description: 'Classic 17th-century English seafaring jargon, full of "Ahoy", "Matey", "Arr!", and salty maritime idioms.' },
      { id: 'pir-NLD', name: 'Pirate Dutch (Kaper-Lingo)', description: 'Historical Dutch privateer dialect from the Zeeland/Enkhuizen fleet, rich in raw North Sea sailor slang.' },
      { id: 'pir-SPA', name: 'Pirate Spanish (Corsario Dialect)', description: 'Castilian Spanish with Caribbean Sea corsair slang, gold-trade plunder terms, and galleon commands.' },
      { id: 'pir-FRA', name: 'Pirate French (Flibustier Patois)', description: '18th-century French buccaneer slang from Tortuga and Port-de-Paix, with West Indies naval vocabulary.' }
    ]
  },
  {
    id: 'combo_group',
    name: 'Combo Languages',
    dialects: [
      { id: 'com-ENFR', name: 'English-French ("’Allo ’Allo!" Style)', description: 'French spoken as British English utilizing a highly comical French-theater accent, mixed phrases, and phonetics.' },
      { id: 'com-NLES', name: 'Dutch-Spanish (Steenkolen-Spaans)', description: 'Dutch spoken with a phonetic Spanish mask, heavy Spanish accent, and hilarious direct translations of Iberian words.' },
      { id: 'com-ENDE', name: 'English-German (Germish / Denglish)', description: 'English spoken with a thick German accent, rigid German word order, heavy consonants, and compound nouns.' },
      { id: 'com-ITFR', name: 'Italian-French (Italo-Français)', description: 'French spoken with theatrical Italian hand-gestured rhythm, sing-song endings, and phonetic exaggeration.' }
    ]
  },
  {
    id: 'click_languages',
    name: 'Click Languages (Khoisan & San)',
    dialects: [
      { id: 'xh-KHO', name: 'Khoekhoe (Nama)', description: 'A major Khoisan click language of Namibia and Botswana, utilizing four distinct types of dental, alveolar, lateral, and palatal click consonants.' },
      { id: 'taa-SAN', name: '!Xóõ (Taa Dialect)', description: 'Spoken in Botswana and Namibia, containing the largest vowel and consonant inventory in the world with over eighty click integrations.' },
      { id: 'kung-SAN', name: 'Ju|\'hoan (ǃKung)', description: 'An iconic San click language of the Kalahari desert region featuring distinct dental, lateral, and alveolar click notations.' },
      { id: 'had-TZ', name: 'Hadza (Hadzane)', description: 'An isolated wilderness language spoken around Lake Eyasi in Tanzania, featuring rhythmic, sharp retroflex buccal clicks.' }
    ]
  },
  {
    id: 'playful_languages',
    name: 'Playful & Coding Languages',
    dialects: [
      { id: 'pig-LAT', name: 'Pig Latin', description: 'A playful English-based argot/language/word-game where the first consonant is moved to the end with "ay", like "ig-pay atin-lay".' },
      { id: 'gib-BER', name: 'Gibberish / Double-Talk', description: 'Fast, playful nonsense syllables mimicking real language sounds without actual semantic meaning, perfect for vocal exercises.' }
    ]
  },
  {
    id: 'historical_english_accents',
    name: 'Historical English Accents (Cinematic)',
    dialects: [
      { id: 'his-VIK', name: 'Viking-English (Norse Accent)', description: 'English spoken with a thick Old Norse phonetic flavor, rolling Rs, robust Viking terminology, and cinematic Norse chants.' },
      { id: 'his-ROM', name: 'Roman-English (Imperial Latin Accent)', description: 'English spoken with imperial Latin gravity, structured grammatical layouts, theatrical Roman military commands, and classical phrasing.' },
      { id: 'his-GRK', name: 'Greek-English (Hellenic Accent)', description: 'English spoken with a dramatic Hellenic accent, rich philosophical rhetoric, rolling vowels, and classical theatrical inflection.' },
      { id: 'his-EGY', name: 'Egyptian-English (Hieroglyphic Accent)', description: 'English spoken with mystical hieroglyphic rhythm, soft guttural whispers, and ceremonial phrases honoring the solar gods.' },
      { id: 'his-SPA', name: 'Spartan-English (Laconic Accent)', description: 'English spoken with fierce, laconic brevity, harsh martial tones, and intense battlefield directives.' },
      { id: 'his-CEL', name: 'Celt-English (Gaelic Lilt)', description: 'English spoken with rolling, lyrical Celtic lilt, mysterious gaelic-resonant vowels, and tribal-folk epic phrasing.' }
    ]
  },
  {
    id: 'smurfs',
    name: 'The Smurfs',
    dialects: [
      { id: 'smf-ENG', name: 'English Smurf (Smurfy English)', description: 'Cheerful, high-pitched English replacing key action verbs and nouns with variations of "smurf" (e.g. "let us smurf a happy smurf")' },
      { id: 'smf-FRA', name: 'French Smurf (Français Schtroumpf)', description: 'Playful French inserting "schtroumpf" as a noun, verb, or adjective, flowing with elegant, high-tempo Parisian woodland rhythm' },
      { id: 'smf-NLD', name: 'Dutch Smurf (Snoezig Smurfs)', description: 'Hyper-active Dutch replacing core roots with "smurf" and "smurfen", mixed with light whistle sounds' },
      { id: 'smf-ESP', name: 'Spanish Smurf (Pitufo Español)', description: 'Energetic Spanish substituting key phrases with "pitufo", "pitufar", or "pitufadora"' },
      { id: 'smf-ITA', name: 'Italian Smurf (Puffo Italiano)', description: 'Operatic, melodic Italian punctuated with "puffo", "puffare", and intense dramatic hand gesture references' },
      { id: 'smf-PPA', name: 'Papa Smurf (Elder Wisdom)', description: 'Authoritative, calm, fatherly tone offering forest magic recipes, safety proverbs, and gentle guidance on dealing with wizards' },
      { id: 'smf-SMF', name: 'Smurfette (Lyrical Sass)', description: 'Feminine, high-spirited, cheerful vocals accented with floral terms, light whistles, and playful sass' },
      { id: 'smf-BRN', name: 'Brainy Smurf (Overly Verbose)', description: 'Extremely talkative, know-it-all lecturing dialect characterized by saying "As Papa Smurf always says..." and endless pedantic reasoning' },
      { id: 'smf-GRY', name: 'Gargamel (Nemesis Growl)', description: 'Evil, obsessive, cackling rasp of the malicious wizard, yelling about catching those little blue pests, accompanied by dynamic cat annotations' }
    ]
  }
];

export const DEFAULT_DIALECT: Dialect = {
  id: 'en-GB',
  name: 'British English',
  description: 'Standard British pronunciations and spelling (RP)'
};

/**
 * Finds a dialect globally by ID, falling back to English (British) if not found.
 */
export function findDialectById(id: string): Dialect {
  for (const group of LANGUAGE_GROUPS) {
    const found = group.dialects.find(d => d.id === id);
    if (found) return found;
  }
  return DEFAULT_DIALECT;
}

/**
 * Finds which LanguageGroup a dialect belongs to.
 */
export function findGroupByDialectId(dialectId: string): LanguageGroup | undefined {
  return LANGUAGE_GROUPS.find(group => 
    group.dialects.some(d => d.id === dialectId)
  );
}
