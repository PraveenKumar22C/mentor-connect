import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Mentor from '../models/Mentor.js';
import connectDB from '../config/database.js';

dotenv.config();

const seedMentors = async () => {
  try {
    await connectDB();
    
    await Mentor.deleteMany({});
    
    const mentors = [
      {
        name: "Dr. Sanjeev Jindal",
        title: "MD Radiodiagnosis resident",
        specialization: "Medical Doctor - Radiodiagnosis",
        experience: 8,
        location: "Chandigarh, Punjab",
        available: true,
        profileImage: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=400&fit=crop&crop=face",
        bio: "Greetings! Offering my mentoring skills to you makes me happy. With a track record of passing competitive exams like NEET UG, NEET PG, UPSC CMS, and ESIC on my first attempt, and over two years of mentorship experience, I understand what it takes to succeed in these tests. My mentoring philosophy revolves around developing customized plans tailored to each student's unique needs. I believe in personalized approaches as every student has different talents and areas for growth. Maintaining a work-life balance in the medical field is crucial for well-being. I'll guide you on managing stress, optimizing time, staying adaptable, and helping students overcome exam stress and fears. I strongly desire to assist you in mastering the skills necessary for success!",
        languages: ["English", "Hindi", "Punjabi"],
        education: [
          {
            degree: "Post graduation (MD Radiodiagnosis)",
            institution: "Government Medical College and Hospital, Chandigarh",
            startYear: 2022,
            endYear: 2025,
            description: "Currently pursuing MD in Radiodiagnosis with focus on advanced imaging techniques"
          },
          {
            degree: "Under Graduation (MBBS)",
            institution: "Government Medical College Patiala, Punjab",
            startYear: 2016,
            endYear: 2022,
            description: "Completed MBBS with distinction and gold medal"
          }
        ],
        achievements: [
          {
            title: "NEET PG Rank 1 in Punjab",
            description: "Secured Rank 1 in Punjab and AIR 163 in NEET PG"
          },
          {
            title: "UPSC CMS Achievement",
            description: "Secured AIR 109 in UPSC CMS"
          },
          {
            title: "MBBS Gold Medalist",
            description: "Gold medalist in MBBS graduation"
          },
          {
            title: "Research Recognition",
            description: "Certification of Appreciation: Poster Presentations at 4th Annual JALCON-23 and Chandigarh Chapter of IRIA"
          }
        ],
        timeSlots: [
          {
            name: "Monday 17:00 - 21:00",
            day: "Monday",
            startTime: "17:00",
            endTime: "21:00",
            available: true
          },
          {
            name: "Tuesday 21:00 - 01:00",
            day: "Tuesday",
            startTime: "21:00",
            endTime: "01:00",
            available: true
          }
        ],
        pricing: [
          { duration: 15, price: 299 },
          { duration: 30, price: 499 },
          { duration: 60, price: 799 }
        ],
        packages: [
          { name: "Basic", sessions: 1, price: 799, duration: 60, features: ["1-on-1 Session", "Email Support"] },
          { name: "Standard", sessions: 3, price: 2299, duration: 60, features: ["3 Sessions", "Email Support", "Resource Materials"] },
          { name: "Premium", sessions: 5, price: 3799, duration: 60, features: ["5 Sessions", "Priority Support", "Custom Plan"] }
        ],
        rating: 4.9,
        totalSessions: 156
      },
      {
        name: "Dr. Priya Sharma",
        title: "Senior Consultant - Internal Medicine",
        specialization: "Internal Medicine",
        experience: 12,
        location: "New Delhi",
        available: true,
        profileImage: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=400&fit=crop&crop=face",
        bio: "Experienced Internal Medicine specialist with over 12 years of clinical practice. Passionate about mentoring medical students and residents in clinical diagnosis, patient care, and medical research. My approach focuses on evidence-based medicine and developing critical thinking skills essential for medical practice.",
        languages: ["English", "Hindi"],
        education: [
          {
            degree: "MD Internal Medicine",
            institution: "All India Institute of Medical Sciences, Delhi",
            startYear: 2010,
            endYear: 2013,
            description: "Specialized training in Internal Medicine with research focus"
          },
          {
            degree: "MBBS",
            institution: "Lady Hardinge Medical College, Delhi",
            startYear: 2005,
            endYear: 2010,
            description: "Graduated with first class honors"
          }
        ],
        achievements: [
          {
            title: "Best Resident Award",
            description: "Received best resident award during MD training at AIIMS"
          },
          {
            title: "Published Research",
            description: "Author of 15+ peer-reviewed publications in internal medicine"
          },
          {
            title: "Clinical Excellence",
            description: "Recognized for excellence in patient care and medical education"
          }
        ],
        timeSlots: [
          {
            name: "Monday 09:00 - 13:00",
            day: "Monday",
            startTime: "09:00",
            endTime: "13:00",
            available: true
          },
          {
            name: "Tuesday 17:00 - 21:00",
            day: "Tuesday",
            startTime: "17:00",
            endTime: "21:00",
            available: true
          }
        ],
        pricing: [
          { duration: 15, price: 399 },
          { duration: 30, price: 699 },
          { duration: 60, price: 1199 }
        ],
        packages: [
          { name: "Basic", sessions: 1, price: 1199, duration: 60, features: ["1-on-1 Session", "Email Support"] },
          { name: "Standard", sessions: 3, price: 3399, duration: 60, features: ["3 Sessions", "Email Support", "Resource Materials"] },
          { name: "Premium", sessions: 5, price: 5699, duration: 60, features: ["5 Sessions", "Priority Support", "Custom Plan"] }
        ],
        rating: 4.8,
        totalSessions: 243
      },
      {
        name: "Dr. Rahul Gupta",
        title: "Cardiology Resident",
        specialization: "Cardiology",
        experience: 6,
        location: "Mumbai, Maharashtra",
        available: true,
        bio: "Cardiology resident with passion for teaching and mentoring. Specialized in interventional cardiology and cardiac imaging. I help students understand complex cardiac concepts and prepare for cardiology competitive exams. My teaching style emphasizes practical application and case-based learning.",
        languages: ["English", "Hindi", "Marathi"],
        education: [
          {
            degree: "DM Cardiology (ongoing)",
            institution: "King Edward Memorial Hospital, Mumbai",
            startYear: 2022,
            endYear: 2025,
            description: "Super-specialty training in Cardiology"
          },
          {
            degree: "MD General Medicine",
            institution: "Grant Medical College, Mumbai",
            startYear: 2019,
            endYear: 2022,
            description: "Completed MD with distinction in General Medicine"
          },
          {
            degree: "MBBS",
            institution: "Seth G.S. Medical College, Mumbai",
            startYear: 2013,
            endYear: 2018,
            description: "Graduated with honors in MBBS"
          }
        ],
        achievements: [
          {
            title: "NEET PG Success",
            description: "Cleared NEET PG with AIR 245"
          },
          {
            title: "Cardiology Conference",
            description: "Presented research at National Cardiology Conference 2023"
          },
          {
            title: "Academic Excellence",
            description: "Consistently ranked in top 5% during medical training"
          }
        ],
        timeSlots: [
          {
            name: "Wednesday 13:00 - 17:00",
            day: "Wednesday",
            startTime: "13:00",
            endTime: "17:00",
            available: true
          },
          {
            name: "Thursday 21:00 - 01:00",
            day: "Thursday",
            startTime: "21:00",
            endTime: "01:00",
            available: true
          }
        ],
        pricing: [
          { duration: 15, price: 349 },
          { duration: 30, price: 599 },
          { duration: 60, price: 999 }
        ],
        packages: [
          { name: "Basic", sessions: 1, price: 999, duration: 60, features: ["1-on-1 Session", "Email Support"] },
          { name: "Standard", sessions: 3, price: 2899, duration: 60, features: ["3 Sessions", "Email Support", "Resource Materials"] },
          { name: "Premium", sessions: 5, price: 4799, duration: 60, features: ["5 Sessions", "Priority Support", "Custom Plan"] }
        ],
        rating: 4.7,
        totalSessions: 89
      },
      {
        name: "Dr. Anita Patel",
        title: "Pediatrics Specialist",
        specialization: "Pediatrics",
        experience: 10,
        location: "Ahmedabad, Gujarat",
        available: true,
        profileImage: "https://images.unsplash.com/photo-1594824475317-640b5ac0b4b5?w=400&h=400&fit=crop&crop=face",
        bio: "Dedicated pediatrician with 10 years of experience in child healthcare. I mentor medical students interested in pediatrics, helping them understand child development, pediatric diseases, and effective communication with young patients and their families. My approach combines clinical excellence with compassionate care.",
        languages: ["English", "Hindi", "Gujarati"],
        education: [
          {
            degree: "MD Pediatrics",
            institution: "B.J. Medical College, Ahmedabad",
            startYear: 2012,
            endYear: 2015,
            description: "Specialized training in Pediatrics and Child Health"
          },
          {
            degree: "MBBS",
            institution: "Government Medical College, Surat",
            startYear: 2007,
            endYear: 2012,
            description: "Completed MBBS with excellent academic record"
          }
        ],
        achievements: [
          {
            title: "Pediatric Excellence Award",
            description: "Received excellence award for pediatric patient care"
          },
          {
            title: "Child Health Advocate",
            description: "Active participant in child health awareness programs"
          },
          {
            title: "Medical Education",
            description: "Regular faculty for undergraduate medical teaching"
          }
        ],
        timeSlots: [
          {
            name: "Monday 09:00 - 13:00",
            day: "Monday",
            startTime: "09:00",
            endTime: "13:00",
            available: true
          },
          {
            name: "Tuesday 13:00 - 17:00",
            day: "Tuesday",
            startTime: "13:00",
            endTime: "17:00",
            available: true
          },
          {
            name: "Wednesday 17:00 - 21:00",
            day: "Wednesday",
            startTime: "17:00",
            endTime: "21:00",
            available: true
          }
        ],
        pricing: [
          { duration: 15, price: 329 },
          { duration: 30, price: 549 },
          { duration: 60, price: 899 }
        ],
        packages: [
          { name: "Basic", sessions: 1, price: 899, duration: 60, features: ["1-on-1 Session", "Email Support"] },
          { name: "Standard", sessions: 3, price: 2599, duration: 60, features: ["3 Sessions", "Email Support", "Resource Materials"] },
          { name: "Premium", sessions: 5, price: 4299, duration: 60, features: ["5 Sessions", "Priority Support", "Custom Plan"] }
        ],
        rating: 4.9,
        totalSessions: 198
      },
      {
        name: "Dr. Vikram Singh",
        title: "Orthopedic Surgeon",
        specialization: "Orthopedics",
        experience: 15,
        location: "Jaipur, Rajasthan",
        available: true,
        profileImage: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400&h=400&fit=crop&crop=face",
        bio: "Senior orthopedic surgeon with extensive experience in trauma surgery and joint replacement. I mentor young doctors interested in surgical specialties, focusing on surgical techniques, patient care, and professional development in orthopedics. My sessions include practical tips for surgical training and career guidance.",
        languages: ["English", "Hindi", "Rajasthani"],
        education: [
          {
            degree: "MS Orthopedics",
            institution: "SMS Medical College, Jaipur",
            startYear: 2008,
            endYear: 2011,
            description: "Master of Surgery in Orthopedics with specialization in trauma"
          },
          {
            degree: "MBBS",
            institution: "Mahatma Gandhi Medical College, Jaipur",
            startYear: 2002,
            endYear: 2007,
            description: "Bachelor of Medicine and Surgery"
          }
        ],
        achievements: [
          {
            title: "Surgical Excellence",
            description: "Performed over 2000 successful orthopedic surgeries"
          },
          {
            title: "Medical Conference Speaker",
            description: "Regular speaker at national orthopedic conferences"
          },
          {
            title: "Research Publications",
            description: "Author of 20+ research papers in orthopedic journals"
          }
        ],
        timeSlots: [
          {
            name: "Friday 17:00 - 21:00",
            day: "Friday",
            startTime: "17:00",
            endTime: "21:00",
            available: true
          },
          {
            name: "Saturday 21:00 - 01:00",
            day: "Saturday",
            startTime: "21:00",
            endTime: "01:00",
            available: true
          }
        ],
        pricing: [
          { duration: 15, price: 449 },
          { duration: 30, price: 799 },
          { duration: 60, price: 1399 }
        ],
        packages: [
          { name: "Basic", sessions: 1, price: 1399, duration: 60, features: ["1-on-1 Session", "Email Support"] },
          { name: "Standard", sessions: 3, price: 3999, duration: 60, features: ["3 Sessions", "Email Support", "Resource Materials"] },
          { name: "Premium", sessions: 5, price: 6699, duration: 60, features: ["5 Sessions", "Priority Support", "Custom Plan"] }
        ],
        rating: 4.8,
        totalSessions: 312
      },
      {
        name: "Dr. Meera Reddy",
        title: "Dermatology Consultant",
        specialization: "Dermatology",
        experience: 8,
        location: "Hyderabad, Telangana",
        available: true,
        profileImage: "https://images.unsplash.com/photo-1551836022-deb4988cc6c0?w=400&h=400&fit=crop&crop=face",
        bio: "Experienced dermatologist with expertise in clinical and cosmetic dermatology. I guide medical students and residents through the intricacies of skin diseases, diagnostic techniques, and treatment modalities. My mentoring includes both theoretical knowledge and practical skills development in dermatology.",
        languages: ["English", "Hindi", "Telugu"],
        education: [
          {
            degree: "MD Dermatology",
            institution: "Osmania Medical College, Hyderabad",
            startYear: 2014,
            endYear: 2017,
            description: "Postgraduate training in Dermatology, Venereology and Leprosy"
          },
          {
            degree: "MBBS",
            institution: "Kurnool Medical College, Andhra Pradesh",
            startYear: 2008,
            endYear: 2013,
            description: "Undergraduate medical education with clinical training"
          }
        ],
        achievements: [
          {
            title: "Dermatology Board Certification",
            description: "Board certified dermatologist with clinical excellence"
          },
          {
            title: "Cosmetic Dermatology Training",
            description: "Advanced training in aesthetic and cosmetic procedures"
          },
          {
            title: "Patient Care Award",
            description: "Recognized for outstanding patient care and satisfaction"
          }
        ],
        timeSlots: [
          {
            name: "Monday 09:00 - 13:00",
            day: "Monday",
            startTime: "09:00",
            endTime: "13:00",
            available: true
          },
          {
            name: "Tuesday 13:00 - 17:00",
            day: "Tuesday",
            startTime: "13:00",
            endTime: "17:00",
            available: true
          }
        ],
        pricing: [
          { duration: 15, price: 379 },
          { duration: 30, price: 649 },
          { duration: 60, price: 1099 }
        ],
        packages: [
          { name: "Basic", sessions: 1, price: 1099, duration: 60, features: ["1-on-1 Session", "Email Support"] },
          { name: "Standard", sessions: 3, price: 3199, duration: 60, features: ["3 Sessions", "Email Support", "Resource Materials"] },
          { name: "Premium", sessions: 5, price: 5299, duration: 60, features: ["5 Sessions", "Priority Support", "Custom Plan"] }
        ],
        rating: 4.7,
        totalSessions: 167
      },
      {
        name: "Dr. Arjun Nair",
        title: "Psychiatry Resident",
        specialization: "Psychiatry",
        experience: 5,
        location: "Kochi, Kerala",
        available: true,
        bio: "Resident in Psychiatry with a passion for mental health awareness and medical education. I mentor students preparing for psychiatry exams and guide them in understanding psychological disorders, therapeutic approaches, and counseling techniques.",
        languages: ["English", "Malayalam", "Hindi"],
        education: [
          {
            degree: "MD Psychiatry (ongoing)",
            institution: "Amrita Institute of Medical Sciences, Kochi",
            startYear: 2021,
            endYear: 2024,
            description: "Postgraduate residency in Psychiatry with clinical research exposure"
          },
          {
            degree: "MBBS",
            institution: "Government Medical College, Trivandrum",
            startYear: 2015,
            endYear: 2020,
            description: "Completed MBBS with focus on behavioral sciences"
          }
        ],
        achievements: [
          {
            title: "Research in Mental Health",
            description: "Presented paper on depression management at National Psychiatry Conference"
          },
          {
            title: "Community Psychiatry Program",
            description: "Conducted awareness programs on mental health for rural populations"
          }
        ],
        timeSlots: [
          {
            name: "Wednesday 13:00 - 17:00",
            day: "Wednesday",
            startTime: "13:00",
            endTime: "17:00",
            available: true
          },
          {
            name: "Thursday 17:00 - 21:00",
            day: "Thursday",
            startTime: "17:00",
            endTime: "21:00",
            available: true
          }
        ],
        pricing: [
          { duration: 15, price: 299 },
          { duration: 30, price: 549 },
          { duration: 60, price: 949 }
        ],
        packages: [
          { name: "Basic", sessions: 1, price: 949, duration: 60, features: ["1-on-1 Session", "Email Support"] },
          { name: "Standard", sessions: 3, price: 2699, duration: 60, features: ["3 Sessions", "Email Support", "Resource Materials"] },
          { name: "Premium", sessions: 5, price: 4499, duration: 60, features: ["5 Sessions", "Priority Support", "Custom Plan"] }
        ],
        rating: 4.6,
        totalSessions: 102
      },
      {
        name: "Dr. Kavita Menon",
        title: "Obstetrics & Gynecology Specialist",
        specialization: "Obstetrics & Gynecology",
        experience: 11,
        location: "Bangalore, Karnataka",
        available: true,
        bio: "Senior gynecologist specializing in reproductive health and maternal care. I mentor young doctors on women’s health, gynecological procedures, and exam preparation for OBGYN residency programs.",
        languages: ["English", "Hindi", "Kannada"],
        education: [
          {
            degree: "MS Obstetrics & Gynecology",
            institution: "St. John’s Medical College, Bangalore",
            startYear: 2010,
            endYear: 2013,
            description: "Specialization in Obstetrics and Gynecology"
          },
          {
            degree: "MBBS",
            institution: "Bangalore Medical College",
            startYear: 2004,
            endYear: 2009,
            description: "Undergraduate medical training"
          }
        ],
        achievements: [
          {
            title: "Excellence in Maternal Health",
            description: "Recognized for safe maternal healthcare practices"
          },
          {
            title: "Research Publication",
            description: "Published multiple papers on reproductive health"
          }
        ],
        timeSlots: [
          {
            name: "Monday 09:00 - 13:00",
            day: "Monday",
            startTime: "09:00",
            endTime: "13:00",
            available: true
          },
          {
            name: "Tuesday 17:00 - 21:00",
            day: "Tuesday",
            startTime: "17:00",
            endTime: "21:00",
            available: true
          }
        ],
        pricing: [
          { duration: 15, price: 399 },
          { duration: 30, price: 699 },
          { duration: 60, price: 1199 }
        ],
        packages: [
          { name: "Basic", sessions: 1, price: 1199, duration: 60, features: ["1-on-1 Session", "Email Support"] },
          { name: "Standard", sessions: 3, price: 3399, duration: 60, features: ["3 Sessions", "Email Support", "Resource Materials"] },
          { name: "Premium", sessions: 5, price: 5699, duration: 60, features: ["5 Sessions", "Priority Support", "Custom Plan"] }
        ],
        rating: 4.8,
        totalSessions: 221
      },
      {
        name: "Dr. Sameer Khan",
        title: "General Surgery Consultant",
        specialization: "General Surgery",
        experience: 14,
        location: "Lucknow, Uttar Pradesh",
        available: true,
        bio: "Consultant surgeon with 14 years of experience in general and laparoscopic surgery. I mentor medical students and junior doctors on surgical approaches, operation theater management, and case-based learning.",
        languages: ["English", "Hindi", "Urdu"],
        education: [
          {
            degree: "MS General Surgery",
            institution: "King George’s Medical University, Lucknow",
            startYear: 2007,
            endYear: 2010,
            description: "Master of Surgery in General Surgery"
          },
          {
            degree: "MBBS",
            institution: "Aligarh Muslim University",
            startYear: 2001,
            endYear: 2006,
            description: "Bachelor of Medicine and Surgery"
          }
        ],
        achievements: [
          {
            title: "Laparoscopic Surgery Pioneer",
            description: "Performed over 1500 successful laparoscopic surgeries"
          },
          {
            title: "Faculty Trainer",
            description: "Trainer at surgical workshops and continuing medical education programs"
          }
        ],
        timeSlots: [
          {
            name: "Wednesday 13:00 - 17:00",
            day: "Wednesday",
            startTime: "13:00",
            endTime: "17:00",
            available: true
          },
          {
            name: "Thursday 21:00 - 01:00",
            day: "Thursday",
            startTime: "21:00",
            endTime: "01:00",
            available: true
          }
        ],
        pricing: [
          { duration: 15, price: 449 },
          { duration: 30, price: 749 },
          { duration: 60, price: 1299 }
        ],
        packages: [
          { name: "Basic", sessions: 1, price: 1299, duration: 60, features: ["1-on-1 Session", "Email Support"] },
          { name: "Standard", sessions: 3, price: 3699, duration: 60, features: ["3 Sessions", "Email Support", "Resource Materials"] },
          { name: "Premium", sessions: 5, price: 6199, duration: 60, features: ["5 Sessions", "Priority Support", "Custom Plan"] }
        ],
        rating: 4.7,
        totalSessions: 275
      }
    ];

    await Mentor.insertMany(mentors);
    console.log('✅ Mentor data seeded successfully');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding mentor data:', error);
    process.exit(1);
  }
};

seedMentors();