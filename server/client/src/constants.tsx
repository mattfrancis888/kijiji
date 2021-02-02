//Note: Make sure it's the same as the viewports defined in scss/utilities/_variables
//We could also use this for media queries:
//https://www.npmjs.com/package/react-responsive
export const SERVER_ERROR_MESSAGE =
    "Uh oh...something went wrong. Check your internet connection and try again.";
export const MED_SCREEN_SIZE = 768;

export const CANADIAN_PROVINCES = [
    { name: "Alberta", abbreviation: "AB" },
    { name: "British Columbia", abbreviation: "BC" },
    { name: "Manitoba", abbreviation: "MB" },
    { name: "New Brunswick", abbreviation: "NB" },
    { name: "Newfoundland And Labrador", abbreviation: "NL" },
    { name: "Northwest Territories", abbreviation: "NT" },
    { name: "Nova Scotia", abbreviation: "NS" },
    { name: "Nunavut", abbreviation: "NU" },
    { name: "Ontario", abbreviation: "ON" },
    { name: "Prince Edward Island", abbreviation: "PE" },
    { name: "Quebec", abbreviation: "QC" },
    { name: "Saskatchewan", abbreviation: "SK" },
    { name: "Yukon Territory", abbreviation: "YT" },
];

export const CANADIAN_PROVINCE_AND_CITIES = [
    {
        province: "Alberta",
        cities: [
            "Airdrie",
            "Grande Prairie",
            "Red Deer",
            "Beaumont",
            "Hanna",
            "St. Albert",
            "Bonnyville",
            "Hinton",
            "Spruce Grove",
            "Brazeau",
            "Irricana",
            "Strathcona County",
            "Breton",
            "Lacombe",
            "Strathmore",
            "Calgary",
            "Leduc",
            "Sylvan Lake",
            "Camrose",
            "Lethbridge",
            "Swan Hills",
            "Canmore",
            "McLennan",
            "Taber",
            "Didzbury",
            "Medicine Hat",
            "Turner Valley",
            "Drayton Valley",
            "Olds",
            "Vermillion",
            "Edmonton",
            "Onoway",
            "Wood Buffalo",
            "Ft. Saskatchewan",
            "Provost",
        ],
    },
    {
        province: "British Columbia",
        cities: [
            "Burnaby",
            "Lumby",
            "City of Port Moody",
            "Cache Creek",
            "Maple Ridge",
            "Prince George",
            "Castlegar",
            "Merritt",
            "Prince Rupert",
            "Chemainus",
            "Mission",
            "Richmond",
            "Chilliwack",
            "Nanaimo",
            "Saanich",
            "Clearwater",
            "Nelson",
            "Sooke",
            "Colwood",
            "New Westminster",
            "Sparwood",
            "Coquitlam",
            "North Cowichan",
            "Surrey",
            "Cranbrook",
            "Terrace",
            "Dawson Creek",
            "North Vancouver",
            "Tumbler",
            "Delta",
            "Osoyoos",
            "Fernie",
            "Parksville",
            "Vancouver",
            "Invermere",
            "Peace River",
            "Vernon",
            "Kamloops",
            "Penticton",
            "Victoria",
            "Kaslo",
            "Port Alberni",
            "Whistler",
            "Langley",
            "Port Hardy",
        ],
    },
    {
        province: "Manitoba",
        cities: [
            "Birtle",
            "Flin Flon",
            "Swan River",
            "Brandon",
            "Snow Lake",
            "The Pas",
            "Cranberry Portage",
            "Steinbach",
            "Thompson",
            "Dauphin",
            "Stonewall",
            "Winnipeg",
        ],
    },
    {
        province: "New Brunswick",
        cities: [
            "Cap-Pele",
            "Miramichi",
            "Saint John",
            "Fredericton",
            "Moncton",
            "Saint Stephen",
            "Grand Bay-Westfield",
            "Oromocto",
            "Shippagan",
            "Grand Falls",
            "Port Elgin",
            "Sussex",
            "Memramcook",
            "Sackville",
            "Tracadie-Sheila",
        ],
    },
    {
        province: "Newfoundland And Labrador",
        cities: [
            "Argentia",
            "Corner Brook",
            "Paradise",
            "Bishop's Falls",
            "Labrador City",
            "Portaux Basques",
            "Botwood",
            "Mount Pearl",
            "St. John's",
            "Brigus",
        ],
    },
    {
        province: "Northwest Territories",
        cities: ["Town of Hay River", "Town of Inuvik", "Yellowknife"],
    },
    {
        province: "Nova Scotia",
        cities: [
            "Amherst",
            "Hants County",
            "Pictou",
            "Annapolis",
            "Inverness County",
            "Pictou County",
            "Argyle",
            "Kentville",
            "Queens",
            "Baddeck",
            "County of Kings",
            "Richmond",
            "Bridgewater",
            "Lunenburg",
            "Shelburne",
            "Cape Breton",
            "Lunenburg County",
            "Stellarton",
            "Chester",
            "Mahone Bay",
            "Truro",
            "Cumberland County",
            "New Glasgow",
            "Windsor",
            "East Hants",
            "New Minas",
            "Yarmouth",
            "Halifax",
            "Parrsboro",
        ],
    },
    {
        province: "Nunavut",
        cities: ["Iqaluit"],
    },
    {
        province: "Ontario",
        cities: [
            "Ajax",
            "Halton",
            "Peterborough",
            "Atikokan",
            "Halton Hills",
            "Pickering",
            "Barrie",
            "Hamilton",
            "Port Bruce",
            "Belleville",
            "Hamilton-Wentworth",
            "Port Burwell",
            "Blandford-Blenheim",
            "Hearst",
            "Port Colborne",
            "Blind River",
            "Huntsville",
            "Port Hope",
            "Brampton",
            "Ingersoll",
            "Prince Edward",
            "Brant",
            "James",
            "Quinte West",
            "Brantford",
            "Kanata",
            "Renfrew",
            "Brock",
            "Kincardine",
            "Richmond Hill",
            "Brockville",
            "King",
            "Sarnia",
            "Burlington",
            "Kingston",
            "Sault Ste. Marie",
            "Caledon",
            "Kirkland Lake",
            "Scarborough",
            "Cambridge",
            "Kitchener",
            "Scugog",
            "Chatham-Kent",
            "Larder Lake",
            "Souix Lookout CoC Sioux Lookout",
            "Chesterville",
            "Leamington",
            "Smiths Falls",
            "Clarington",
            "Lennox-Addington",
            "South-West Oxford",
            "Cobourg",
            "Lincoln",
            "St. Catharines",
            "Cochrane",
            "Lindsay",
            "St. Thomas",
            "Collingwood",
            "London",
            "Stoney Creek",
            "Cornwall",
            "Loyalist Township",
            "Stratford",
            "Cumberland",
            "Markham",
            "Sudbury",
            "Deep River",
            "Metro Toronto",
            "Temagami",
            "Dundas",
            "Merrickville",
            "Thorold",
            "Durham",
            "Milton",
            "Thunder Bay",
            "Dymond",
            "Nepean",
            "Tillsonburg",
            "Ear Falls",
            "Newmarket",
            "Timmins",
            "East Gwillimbury",
            "Niagara",
            "Toronto",
            "East Zorra-Tavistock",
            "Niagara Falls",
            "Uxbridge",
            "Elgin",
            "Niagara-on-the-Lake",
            "Vaughan",
            "Elliot Lake",
            "North Bay",
            "Wainfleet",
            "Flamborough",
            "North Dorchester",
            "Wasaga Beach",
            "Fort Erie",
            "North Dumfries",
            "Waterloo",
            "Fort Frances",
            "North York",
            "Waterloo",
            "Gananoque",
            "Norwich",
            "Welland",
            "Georgina",
            "Oakville",
            "Wellesley",
            "Glanbrook",
            "Orangeville",
            "West Carleton",
            "Gloucester",
            "Orillia",
            "West Lincoln",
            "Goulbourn",
            "Osgoode",
            "Whitby",
            "Gravenhurst",
            "Oshawa",
            "Wilmot",
            "Grimsby",
            "Ottawa",
            "Windsor",
            "Guelph",
            "Ottawa-Carleton",
            "Woolwich",
            "Haldimand-Norfork",
            "Owen Sound",
            "York",
        ],
    },
    {
        province: "Prince Edward Island",
        cities: [
            "Alberton",
            "Montague",
            "Stratford",
            "Charlottetown",
            "Souris",
            "Summerside",
            "Cornwall",
        ],
    },
    {
        province: "Quebec",
        cities: [
            "Alma",
            "Fleurimont",
            "Longueuil",
            "Amos",
            "Gaspe",
            "Marieville",
            "Anjou",
            "Gatineau",
            "Mount Royal",
            "Aylmer",
            "Hull",
            "Montreal",
            "Beauport",
            "Joliette",
            "Montreal Region",
            "Bromptonville",
            "Jonquiere",
            "Montreal-Est",
            "Brosssard",
            "Lachine",
            "Quebec",
            "Chateauguay",
            "Lasalle",
            "Saint-Leonard",
            "Chicoutimi",
            "Laurentides",
            "Sherbrooke",
            "Coaticook",
            "LaSalle",
            "Sorel",
            "Coaticook",
            "Laval",
            "Thetford Mines",
            "Dorval",
            "Lennoxville",
            "Victoriaville",
            "Drummondville",
            "Levis",
        ],
    },
    {
        province: "Saskatchewan",
        cities: [
            "Avonlea",
            "Melfort",
            "Swift Current",
            "Colonsay",
            "Nipawin",
            "Tisdale",
            "Craik",
            "Prince Albert",
            "Unity",
            "Creighton",
            "Regina",
            "Weyburn",
            "Eastend",
            "Saskatoon",
            "Wynyard",
            "Esterhazy",
            "Shell Lake",
            "Yorkton",
            "Gravelbourg",
        ],
    },
    {
        province: "Yukon Territory",
        cities: ["Carcross", "Whitehorse"],
    },
];
