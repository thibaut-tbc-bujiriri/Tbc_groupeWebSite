// Données des formateurs - Peut être modifié via l'interface admin ou localStorage
const defaultTrainers = [
  {
    id: 1,
    name: 'Thibaut Tbc Bujiriri',
    title: 'Formateur & Développeur Fullstack JavaScript',
    bio: 'Passionné par le développement web et mobile, je partage mon expertise et mon expérience à travers des formations complètes et pratiques. Mon objectif est de former la prochaine génération de développeurs JavaScript compétents et autonomes.',
    bioExtended: 'Avec plusieurs années d\'expérience en développement fullstack et en formation, j\'ai accompagné de nombreux étudiants dans leur parcours vers la maîtrise des technologies modernes. Ma pédagogie privilégie la pratique et la réalisation de projets concrets.',
    image: '/images/thibaut-profile.jpg',
    email: 'thibauttbcbujiriri@gmail.com',
    phone: '+243 979 823 604',
    experiences: [
      {
        year: '2020 - Présent',
        title: 'Formateur Fullstack JavaScript',
        description: 'Formation de développeurs aux technologies modernes du web et du mobile dans l\'écosystème JavaScript.',
      },
      {
        year: '2018 - Présent',
        title: 'Développeur Fullstack JavaScript',
        description: 'Développement d\'applications web et mobile pour diverses entreprises et startups.',
      },
    ],
    skills: [
      { name: 'React / React Native', level: 95 },
      { name: 'Node.js / Express', level: 90 },
      { name: 'JavaScript / TypeScript', level: 95 },
      { name: 'MongoDB / PostgreSQL', level: 85 },
      { name: 'Next.js / Vue.js', level: 88 },
      { name: 'Git / GitHub', level: 90 },
    ],
    technologies: [
      'JavaScript ES6+',
      'TypeScript',
      'React',
      'React Native',
      'Next.js',
      'Node.js',
      'Express',
      'Vue.js',
      'Angular',
      'MongoDB',
      'PostgreSQL',
      'Firebase',
      'GraphQL',
      'REST APIs',
      'Git',
      'Docker',
      'AWS',
      'TailwindCSS',
    ],
  },
]

// Fonction pour charger les formateurs depuis localStorage ou utiliser les données par défaut
export const getTrainers = () => {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('trainers')
    if (stored) {
      try {
        return JSON.parse(stored)
      } catch (e) {
        console.error('Error parsing trainers from localStorage', e)
        return defaultTrainers
      }
    }
  }
  return defaultTrainers
}

// Fonction pour sauvegarder les formateurs dans localStorage
export const saveTrainers = (trainers) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('trainers', JSON.stringify(trainers))
  }
}

// Fonction pour ajouter un formateur
export const addTrainer = (trainer) => {
  const trainers = getTrainers()
  const newTrainer = {
    ...trainer,
    id: trainers.length > 0 ? Math.max(...trainers.map(t => t.id)) + 1 : 1,
  }
  const updatedTrainers = [...trainers, newTrainer]
  saveTrainers(updatedTrainers)
  return updatedTrainers
}

// Fonction pour supprimer un formateur
export const deleteTrainer = (id) => {
  const trainers = getTrainers()
  const updatedTrainers = trainers.filter(t => t.id !== id)
  saveTrainers(updatedTrainers)
  return updatedTrainers
}

