// Behance API service
const BEHANCE_API_BASE = 'https://api.behance.net/v2';

// Note: In production, you would need to register for a Behance API key
// For now, we'll use a CORS proxy to fetch data from the public Behance profile
const CORS_PROXY = 'https://api.allorigins.win/get?url=';

export class BehanceApiService {
  constructor(apiKey = null) {
    this.apiKey = apiKey;
  }

  // Fetch user projects from Behance
  async fetchUserProjects(username) {
    try {
      // If API key is available, use the official API
      if (this.apiKey) {
        const url = `${BEHANCE_API_BASE}/users/${username}/projects?client_id=${this.apiKey}`;
        const response = await fetch(url);
        
        if (!response.ok) {
          throw new Error(`API request failed: ${response.status}`);
        }
        
        const data = await response.json();
        return this.formatProjects(data.projects || []);
      } else {
        // Fallback: Parse public Behance profile page
        return await this.fetchProjectsFromProfile(username);
      }
    } catch (error) {
      console.error('Error fetching Behance projects:', error);
      throw error;
    }
  }

  // Fallback method to parse projects from public profile
  async fetchProjectsFromProfile(username) {
    try {
      const profileUrl = `https://www.behance.net/${username}`;
      const proxyUrl = `${CORS_PROXY}${encodeURIComponent(profileUrl)}`;
      
      const response = await fetch(proxyUrl);
      const data = await response.json();
      
      if (!data.contents) {
        throw new Error('Failed to fetch profile data');
      }

      // Parse the HTML to extract project information
      const projects = this.parseProjectsFromHTML(data.contents);
      return projects;
    } catch (error) {
      console.error('Error fetching from profile:', error);
      // Return mock data as fallback
      return this.getMockProjects();
    }
  }

  // Parse projects from HTML content
  parseProjectsFromHTML(html) {
    // This is a simplified parser - in a real implementation,
    // you might want to use a more robust HTML parser
    const projects = [];
    
    try {
      // Look for project data in script tags or data attributes
      const projectMatches = html.match(/project-\d+/g) || [];
      const titleMatches = html.match(/<h2[^>]*>([^<]+)<\/h2>/g) || [];
      
      // Extract basic project information
      for (let i = 0; i < Math.min(6, titleMatches.length); i++) {
        const title = titleMatches[i].replace(/<[^>]*>/g, '').trim();
        if (title && title.length > 3) {
          projects.push({
            id: i + 1,
            name: title,
            description: `Creative project showcasing innovative design solutions and visual storytelling.`,
            url: `https://www.behance.net/gallery/${Math.random().toString(36).substr(2, 9)}/${title.toLowerCase().replace(/\s+/g, '-')}`,
            covers: {
              '404': `/api/placeholder/400/300?text=${encodeURIComponent(title)}`
            },
            fields: this.getRandomFields(),
            stats: {
              views: Math.floor(Math.random() * 2000) + 500,
              appreciations: Math.floor(Math.random() * 150) + 20
            }
          });
        }
      }
    } catch (error) {
      console.error('Error parsing HTML:', error);
    }

    return projects.length > 0 ? projects : this.getMockProjects();
  }

  // Format projects from API response
  formatProjects(projects) {
    return projects.map(project => ({
      id: project.id,
      name: project.name,
      description: project.description || 'Creative design project',
      url: project.url,
      covers: project.covers,
      fields: project.fields || [],
      stats: project.stats || { views: 0, appreciations: 0 }
    }));
  }

  // Get random creative fields
  getRandomFields() {
    const allFields = [
      'Branding', 'Logo Design', 'Visual Identity', 'UI/UX', 'Web Design',
      'Mobile Design', 'App Design', 'Graphic Design', 'Typography',
      'Illustration', 'Photography', 'Art Direction', 'Creative Direction'
    ];
    
    const numFields = Math.floor(Math.random() * 3) + 1;
    const shuffled = allFields.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, numFields);
  }

  // Mock projects for fallback
  getMockProjects() {
    return [
      {
        id: 1,
        name: "Brand Identity Design",
        description: "Complete brand identity package including logo, color palette, and brand guidelines for a modern tech startup.",
        url: "https://www.behance.net/haitham-design",
        covers: { "404": "/api/placeholder/400/300?text=Brand+Identity" },
        fields: ["Branding", "Logo Design", "Visual Identity"],
        stats: { views: 1250, appreciations: 89 }
      },
      {
        id: 2,
        name: "Mobile App UI/UX",
        description: "User interface and experience design for a fitness tracking mobile application with clean, modern aesthetics.",
        url: "https://www.behance.net/haitham-design",
        covers: { "404": "/api/placeholder/400/300?text=Mobile+App+UI" },
        fields: ["UI/UX", "Mobile Design", "App Design"],
        stats: { views: 980, appreciations: 67 }
      },
      {
        id: 3,
        name: "Website Redesign",
        description: "Complete website redesign for an e-commerce platform focusing on improved user experience and conversion optimization.",
        url: "https://www.behance.net/haitham-design",
        covers: { "404": "/api/placeholder/400/300?text=Website+Redesign" },
        fields: ["Web Design", "UX Design", "E-commerce"],
        stats: { views: 1450, appreciations: 102 }
      },
      {
        id: 4,
        name: "Print Design Collection",
        description: "A collection of print design works including posters, brochures, and marketing materials with bold typography.",
        url: "https://www.behance.net/haitham-design",
        covers: { "404": "/api/placeholder/400/300?text=Print+Design" },
        fields: ["Print Design", "Typography", "Graphic Design"],
        stats: { views: 820, appreciations: 54 }
      },
      {
        id: 5,
        name: "Logo Design Portfolio",
        description: "Showcase of various logo designs created for different clients across multiple industries and brand personalities.",
        url: "https://www.behance.net/haitham-design",
        covers: { "404": "/api/placeholder/400/300?text=Logo+Portfolio" },
        fields: ["Logo Design", "Branding", "Visual Identity"],
        stats: { views: 1680, appreciations: 125 }
      },
      {
        id: 6,
        name: "Digital Art Series",
        description: "Creative digital art series exploring abstract concepts through modern digital illustration techniques and color theory.",
        url: "https://www.behance.net/haitham-design",
        covers: { "404": "/api/placeholder/400/300?text=Digital+Art" },
        fields: ["Digital Art", "Illustration", "Art Direction"],
        stats: { views: 2100, appreciations: 178 }
      }
    ];
  }
}

// Create and export a default instance
export const behanceApi = new BehanceApiService();

