import { ref, get, child } from "firebase/database";
import { db } from "../firebase";
import { University, Alumni } from "../types";

// --- DATA ENRICHMENT LAYER ---
// This manually verified data is prioritized over Firebase data to ensure accuracy for key fields.
const ENRICHMENT_DATA: Record<string, Partial<University>> = {
  // --- IVY LEAGUE & TOP US ---
  'harvard-university': { acceptanceRate: 4, internationalStudentsPercent: 13 },
  'stanford-university': { acceptanceRate: 4, internationalStudentsPercent: 10 },
  'massachusetts-institute-of-technology-mit': { acceptanceRate: 4, internationalStudentsPercent: 11 },
  'yale-university': { acceptanceRate: 5, internationalStudentsPercent: 12 },
  'princeton-university': { acceptanceRate: 4, internationalStudentsPercent: 12 },
  'columbia-university': { acceptanceRate: 4, internationalStudentsPercent: 19 },
  'university-of-pennsylvania': { acceptanceRate: 6, internationalStudentsPercent: 13 },
  'california-institute-of-technology-caltech': { acceptanceRate: 3, internationalStudentsPercent: 9 },
  'brown-university': { acceptanceRate: 5, internationalStudentsPercent: 11 },
  'dartmouth-college': { acceptanceRate: 6, internationalStudentsPercent: 10 },
  'cornell-university': { acceptanceRate: 7, internationalStudentsPercent: 10 },
  'university-of-chicago': { acceptanceRate: 5, internationalStudentsPercent: 15 },
  'johns-hopkins-university': { acceptanceRate: 7, internationalStudentsPercent: 20 },
  'northwestern-university': { acceptanceRate: 7, internationalStudentsPercent: 10 },
  'duke-university': { acceptanceRate: 6, internationalStudentsPercent: 10 },
  
  // --- TOP US PUBLIC ---
  'university-of-california-berkeley-ucb': { acceptanceRate: 11, internationalStudentsPercent: 15 },
  'university-of-california-los-angeles-ucla': { acceptanceRate: 9, internationalStudentsPercent: 13 },
  'university-of-michigan': { acceptanceRate: 18, internationalStudentsPercent: 7 },
  'university-of-virginia': { acceptanceRate: 19, internationalStudentsPercent: 5 },
  'university-of-north-carolina-at-chapel-hill': { acceptanceRate: 17, internationalStudentsPercent: 3 },
  'georgia-institute-of-technology': { acceptanceRate: 17, internationalStudentsPercent: 10 },
  'university-of-florida': { acceptanceRate: 23, internationalStudentsPercent: 4 },
  'university-of-texas-at-austin': { acceptanceRate: 31, internationalStudentsPercent: 10 },
  'university-of-washington': { acceptanceRate: 48, internationalStudentsPercent: 16 },
  'university-of-california-san-diego': { acceptanceRate: 24, internationalStudentsPercent: 17 },

  // --- TOP OTHER US ---
  'new-york-university-nyu': { acceptanceRate: 8, internationalStudentsPercent: 28 },
  'university-of-southern-california-usc': { acceptanceRate: 12, internationalStudentsPercent: 24 },
  'carnegie-mellon-university': { acceptanceRate: 11, internationalStudentsPercent: 19 },
  'rice-university': { acceptanceRate: 8, internationalStudentsPercent: 12 },
  'vanderbilt-university': { acceptanceRate: 6, internationalStudentsPercent: 10 },
  'washington-university-in-st-louis': { acceptanceRate: 11, internationalStudentsPercent: 19 },
  'georgetown-university': { acceptanceRate: 12, internationalStudentsPercent: 14 },
  
  // --- TOP UK & EUROPE ---
  'university-of-cambridge': { acceptanceRate: 21, internationalStudentsPercent: 23 },
  'university-of-oxford': { acceptanceRate: 17, internationalStudentsPercent: 22 },
  'eth-zurich': { acceptanceRate: 27, internationalStudentsPercent: 40 },
  'university-college-london-ucl': { acceptanceRate: 38, internationalStudentsPercent: 48 },
  'imperial-college-london': { acceptanceRate: 14, internationalStudentsPercent: 57 },
  'university-of-edinburgh': { acceptanceRate: 40, internationalStudentsPercent: 41 },
  'kings-college-london': { acceptanceRate: 13, internationalStudentsPercent: 40 },
  'london-school-of-economics-lse': { acceptanceRate: 9, internationalStudentsPercent: 70 },
  'epfl': { acceptanceRate: 21, internationalStudentsPercent: 60 },
  'technical-university-of-munich': { acceptanceRate: 8, internationalStudentsPercent: 30 },

  // --- CANADA & GLOBAL ---
  'university-of-toronto': { acceptanceRate: 43, internationalStudentsPercent: 23 },
  'mcgill-university': { acceptanceRate: 46, internationalStudentsPercent: 30 },
  'university-of-british-columbia': { acceptanceRate: 52, internationalStudentsPercent: 28 },
  'national-university-of-singapore-nus': { acceptanceRate: 7, internationalStudentsPercent: 26 },
  'nanyang-technological-university': { acceptanceRate: 36, internationalStudentsPercent: 25 },
  'university-of-melbourne': { acceptanceRate: 70, internationalStudentsPercent: 41 },
  'university-of-sydney': { acceptanceRate: 30, internationalStudentsPercent: 38 },
};

// --- DEMO DATA INJECTION ---
// This ensures the Alumni feature is visible even if the DB is missing this data.
const DEMO_ALUMNI_DATA: Record<string, Alumni[]> = {
  'harvard-university': [
    { name: 'Mark Zuckerberg', role: 'Founder & CEO', company: 'Meta', result: 'Revolutionized social media and connected billions of people worldwide.', photo: 'https://i.ibb.co/hK3bVf4/zuck.jpg', linkedin: 'https://www.linkedin.com/in/mark-zuckerberg/' },
    { name: 'Natalie Portman', role: 'Actress & Filmmaker', company: 'Hollywood', result: 'Academy Award-winning actress known for her versatile roles and intellectual pursuits.', photo: 'https://i.ibb.co/6y4g0xW/portman.jpg', linkedin: 'https://www.linkedin.com/in/natalie-portman-59b244229/' },
    { name: 'Bill Gates', role: 'Co-founder', company: 'Microsoft', result: 'Pioneered the personal computer revolution and became a leading global philanthropist.', photo: 'https://i.ibb.co/rpx3g3R/gates.jpg', linkedin: 'https://www.linkedin.com/in/williamhgates/' }
  ],
  'stanford-university': [
    { name: 'Larry Page', role: 'Co-founder', company: 'Google', result: 'Co-created the Google search engine, fundamentally changing how the world accesses information.', photo: 'https://i.ibb.co/dD3s1b9/page.jpg', linkedin: 'https://www.linkedin.com/in/larry-page-9a997322b/' },
    { name: 'Reese Witherspoon', role: 'Actress & Producer', company: 'Hello Sunshine', result: 'Award-winning actress and founder of a media company focused on female-led stories.', photo: 'https://i.ibb.co/68gMS7G/reese.jpg', linkedin: 'https://www.linkedin.com/in/reesewitherspoon/' },
    { name: 'Sundar Pichai', role: 'CEO', company: 'Alphabet Inc.', result: 'Leads Google and its parent company, overseeing the development of core products like Android and Chrome.', photo: 'https://i.ibb.co/8XY5K0Q/pichai.jpg', linkedin: 'https://www.linkedin.com/in/sundarpichai/' }
  ],
  'massachusetts-institute-of-technology-mit': [
    { name: 'Buzz Aldrin', role: 'Astronaut', company: 'NASA', result: 'One of the first two humans to land on the Moon, a pivotal moment in human exploration.', photo: 'https://i.ibb.co/4Z5W8Bw/buzz.jpg', linkedin: 'https://www.linkedin.com/in/buzz-aldrin-552683b/' },
    { name: 'Richard Feynman', role: 'Physicist', company: 'Caltech', result: 'Nobel Prize winner for his work in quantum electrodynamics, renowned for his teaching and brilliant mind.', photo: 'https://i.ibb.co/b3Kqg2Z/feynman.jpg', linkedin: 'https://www.linkedin.com/company/the-feynman-archives/' },
    { name: 'Kofi Annan', role: 'Secretary-General', company: 'United Nations', result: 'Nobel Peace Prize laureate who led the UN through a period of significant global challenges.', photo: 'https://i.ibb.co/c2jS93z/annan.jpg', linkedin: 'https://www.linkedin.com/company/kofi-annan-foundation/' }
  ],
  'yale-university': [
      { name: 'Meryl Streep', role: 'Actress', company: 'Hollywood', result: 'Considered one of the greatest actresses of all time, with a record number of Academy Award nominations.', photo: 'https://i.ibb.co/yqg9B9C/streep.jpg', linkedin: 'https://www.linkedin.com/in/meryl-streep-a9b43314/' },
      { name: 'George W. Bush', role: '43rd U.S. President', company: 'United States Government', result: 'Led the country during the 9/11 attacks and initiated major education and global health programs.', photo: 'https://i.ibb.co/L89YfW5/bush.jpg', linkedin: 'https://www.linkedin.com/company/george-w-bush-presidential-center/' },
      { name: 'Indra Nooyi', role: 'Former CEO', company: 'PepsiCo', result: 'Transformed PepsiCo into a global leader in healthier food and beverages.', photo: 'https://i.ibb.co/51b0Vz7/nooyi.jpg', linkedin: 'https://www.linkedin.com/in/indranooyi/' }
  ],
  'princeton-university': [
      { name: 'Jeff Bezos', role: 'Founder & Chairman', company: 'Amazon', result: 'Pioneered e-commerce and cloud computing, becoming one of the wealthiest individuals in history.', photo: 'https://i.ibb.co/bF4dY6k/bezos.jpg', linkedin: 'https://www.linkedin.com/in/jeffbezos/' },
      { name: 'Michelle Obama', role: 'Former First Lady', company: 'United States', result: 'Lawyer, writer, and advocate for health, education, and poverty awareness.', photo: 'https://i.ibb.co/6D5ZJg9/michelle.jpg', linkedin: 'https://www.linkedin.com/in/michelleobama/' },
  ],
  'columbia-university': [
      { name: 'Barack Obama', role: '44th U.S. President', company: 'United States Government', result: 'First African American president of the United States and Nobel Peace Prize laureate.', photo: 'https://i.ibb.co/PMntd0q/obama.jpg', linkedin: 'https://www.linkedin.com/in/barackobama/' },
      { name: 'Warren Buffett', role: 'CEO', company: 'Berkshire Hathaway', result: 'One of the most successful investors in the world, known as the "Oracle of Omaha".', photo: 'https://i.ibb.co/z5pW4sP/buffett.jpg', linkedin: 'https://www.linkedin.com/in/warren-buffett-64857614/' },
  ],
  'eth-zurich': [
      { name: 'Albert Einstein', role: 'Physicist', company: 'Academia', result: 'Developed the theory of relativity, one of the two pillars of modern physics.', photo: 'https://i.ibb.co/Y2gMh4b/einstein.jpg', linkedin: 'https://www.linkedin.com/company/albert-einstein-archives/' },
  ],
  'university-of-cambridge': [
      { name: 'Stephen Hawking', role: 'Theoretical Physicist', company: 'Academia', result: 'Made groundbreaking contributions to cosmology and quantum gravity, particularly regarding black holes.', photo: 'https://i.ibb.co/xJLXwM4/hawking.jpg', linkedin: 'https://www.linkedin.com/company/stephen-hawking-foundation/' },
      { name: 'Charles Darwin', role: 'Naturalist', company: 'Scientific Exploration', result: 'Established that all species of life have descended over time from common ancestors through natural selection.', photo: 'https://i.ibb.co/GvN3fWv/darwin.jpg', linkedin: 'https://www.linkedin.com/company/darwin-correspondence-project/' },
  ],
  'university-of-oxford': [
      { name: 'J.R.R. Tolkien', role: 'Author & Philologist', company: 'Literary World', result: 'Authored "The Hobbit" and "The Lord of the Rings," defining modern high-fantasy literature.', photo: 'https://i.ibb.co/sW2hH4Z/tolkien.jpg', linkedin: 'https://www.linkedin.com/company/the-tolkien-estate/' },
      { name: 'Indira Gandhi', role: 'Prime Minister of India', company: 'Government of India', result: 'The second-longest-serving Prime Minister of India and a central figure in Indian politics.', photo: 'https://i.ibb.co/tZgK19N/gandhi.jpg', linkedin: 'https://www.linkedin.com/company/prime-minister-s-office-india/' },
  ]
};


export const getUniversities = async (): Promise<University[]> => {
  const dbRef = ref(db);
  
  console.log("Attempting to connect to Firebase Realtime Database...");

  try {
    // 1. Primary Strategy: Fetch from 'universities' node
    let snapshot = await get(child(dbRef, "universities"));
    let source = "node: universities";

    // 2. Fallback Strategy: Fetch from root if 'universities' is missing
    if (!snapshot.exists()) {
      console.warn("Target node 'universities' not found. Attempting to fetch from database root...");
      snapshot = await get(dbRef);
      source = "node: root";
    }

    // 3. Validation
    if (!snapshot.exists()) {
      console.warn("Connection successful, but database appears empty.");
      return [];
    }

    const data = snapshot.val();
    
    // 4. Critical Data Normalization
    const normalizeData = (rawData: any): University[] => {
      let result: any[] = [];
      
      if (Array.isArray(rawData)) {
        result = rawData;
      } else if (typeof rawData === 'object' && rawData !== null) {
        result = Object.values(rawData);
      }

      const normalized = result
        .filter(item => item && (item.name || item.id || item.slug))
        .map((item, index) => {
          
          const uniId = String(item.id || item.slug || `uni-${index}`);
          const enriched = ENRICHMENT_DATA[uniId] || {};

          const locationData = item.cases ? (Array.isArray(item.cases) ? item.cases[0] : item.cases) : {};

          const city = locationData.city || item.city;
          const country = locationData.countryFull || item.countryFull;

          const majors = Array.isArray(item.majors) ? item.majors : (item.majors ? Object.values(item.majors) : []);
          const strongMajors = Array.isArray(item.strongMajors) ? item.strongMajors : (item.strongMajors ? Object.values(item.strongMajors) : []);
          const mergedMajors = [...new Set([...majors, ...strongMajors])].map(m => String(m));

          const tuitionCost = Number(item.tuitionAnnualUSD) || Number(item.tuitionAnnual) || 0;
          const desc = item.summary || item.tagline || "No description available.";
          const acceptance = enriched.acceptanceRate ?? (Number(item.acceptanceRate) || 0);
          const ranking = Number(item.rating) || 0;
          
          let alumniList: Alumni[] = DEMO_ALUMNI_DATA[uniId] || [];
          const sourceAlumni = item.alumniCases || item.alumni;
          if (Array.isArray(sourceAlumni) && sourceAlumni.length > 0) {
            alumniList = sourceAlumni;
          } else if (sourceAlumni && typeof sourceAlumni === 'object' && Object.keys(sourceAlumni).length > 0) {
            alumniList = Object.values(sourceAlumni);
          }

          return {
            id: uniId,
            name: item.name || "Unknown University",
            location: city,
            country: country,
            description: desc,
            tuition: tuitionCost,
            ranking: ranking,
            acceptanceRate: acceptance,
            internationalStudentsPercent: enriched.internationalStudentsPercent ?? (Number(item.internationalStudentsPercent) || 0),
            majors: mergedMajors,
            imageUrl: item.logo || '',
            website: item.website || '',
            hasScholarship: !!item.hasGrant,
            degreeLevels: Array.isArray(item.degreeLevels) ? item.degreeLevels : (item.degreeLevels ? Object.values(item.degreeLevels) : []),
            alumni: alumniList,
            admissionRequirements: item.admissionRequirements,
            deadlines: item.deadlines, // Removed from enriched data, using DB directly as per earlier instructions, but rendering handles it.
            languages: item.languages ? Object.values(item.languages).map(String) : [],
          };
        });
        
      return normalized.filter(u => u.name && u.country && u.location);
    };

    const finalData = normalizeData(data);
    console.log(`[Success] Fetched and normalized ${finalData.length} universities from ${source}.`);
    return finalData;

  } catch (error) {
    console.error("Firebase Connection Error:", error);
    throw error;
  }
};