export const schemes = [
  {
    id: "patham-pathukappom",
    name: "Patham Pathukappom Thittam",
    tagline: "Diabetic Foot Care & Amputation Prevention",
    description:
      "A pioneering initiative by the Government of Tamil Nadu to prevent diabetic foot complications through early screening, treatment, and patient education.",
    eligibility: "All diabetic patients in Tamil Nadu",
    benefits: [
      "Free foot screening across Tamil Nadu",
      "Early detection of neuropathy and ulcers",
      "Specialized diabetic foot clinics",
      "Advanced surgical and rehabilitation care",
    ],
    coverage:
      "2,336 PHCs, 299 Government Hospitals, 36 Medical College Hospitals",
    color: "bg-teal-700",
  },
  {
    id: "cmchiss",
    name: "Chief Minister’s Comprehensive Health Insurance Scheme (CMCHIS)",
    tagline: "Cashless Health Insurance for Families",
    description:
      "Provides cashless hospitalization and medical treatments up to ₹5 lakh per family per year for eligible beneficiaries.",
    eligibility: "Families with annual income below ₹72,000",
    benefits: [
      "Cashless treatment up to ₹5 lakh",
      "Covers 1,090+ procedures",
      "No waiting for pre-existing diseases",
      "Covers cancer, cardiac & major surgeries",
    ],
    coverage: "800+ Government & 900+ Private Hospitals",
    color: "bg-blue-800",
  },
  {
    id: "innuyir-kappom",
    name: "Innuyir Kappom – Nammai Kaakkum 48",
    tagline: "Free Emergency Accident Care",
    description:
      "Ensures immediate, life-saving treatment for road accident victims during the first 48 hours.",
    eligibility: "All road accident victims (no restrictions)",
    benefits: [
      "Free emergency care up to ₹2 lakh",
      "No discrimination by nationality",
      "Covers trauma, neuro & orthopedic care",
      "Applicable in govt & private hospitals",
    ],
    coverage: "737+ Empanelled Hospitals",
    color: "bg-emerald-700",
  },

  {
    id: "cmchis",
    name: "Chief Minister’s Comprehensive Health Insurance Scheme (CMCHIS)",
    tagline: "Cashless Medical Treatment for Economically Weaker Sections",
    description:
      "Launched in 2009 (formerly Kalaignar Kaappittu Thittam), CMCHIS aims to provide quality cashless healthcare through empanelled government and private hospitals, reducing financial hardship and moving towards universal health coverage in Tamil Nadu.",

    eligibility:
      "Residents of Tamil Nadu with family annual income below ₹1,20,000 and listed in the family ration card",

    benefits: [
      "Cashless hospitalization up to ₹5,00,000 per family per year",
      "Coverage for 1,090 medical procedures",
      "Includes 8 follow-up procedures and 52 diagnostic procedures",
      "No waiting period for pre-existing diseases",
      "Covers critical illnesses, cancer, cardiac & major surgeries",
    ],

    coverage:
      "800 Government Hospitals and 900 Private Empanelled Hospitals",

    exclusions: [
      "Non-residents of Tamil Nadu",
      "Families with income above ₹72,000",
      "Members not listed in the ration card",
      "Migrants without valid migration certificate",
      "Non-citizens without proof",
    ],

    applicationProcess: {
      mode: "Offline",
      steps: [
        "Obtain income certificate from VAO / Revenue Authorities",
        "Collect Aadhaar card, ration card, and income certificate",
        "Visit CMCHIS enrollment center",
        "Submit documents for verification",
        "Provide biometric details (fingerprint, photo, eye scan)",
        "Receive CMCHIS e-card after verification",
      ],
    },

    documentsRequired: [
      "Income Certificate (VAO / Revenue Authority)",
      "Ration Card",
      "Aadhaar Card",
      "Self-declaration from Head of Family",
      "Address Proof",
      "PAN Card (optional)",
    ],

    implementedBy: "United India Insurance Company (2022–2027)",
    beneficiaries: "1.37 crore families",

    color: "bg-blue-800",
  }

];
