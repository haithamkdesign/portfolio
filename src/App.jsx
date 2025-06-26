import React, { useState, useEffect } from 'react';
import { Mail, Github, Linkedin, ExternalLink, Eye, Heart, RefreshCw } from 'lucide-react';
import { behanceApi } from './services/behanceApi';
import './App.css';

const FloatingParticles = () => {
  const particles = Array.from({ length: 20 }, (_, i) => (
    <div
      key={i}
      className="particle"
      style={{
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        width: `${Math.random() * 4 + 2}px`,
        height: `${Math.random() * 4 + 2}px`,
        animationDelay: `${Math.random() * 6}s`,
        animationDuration: `${Math.random() * 4 + 4}s`,
      }}
    />
  ));
  return <div className="fixed inset-0 overflow-hidden pointer-events-none">{particles}</div>;
};

const ProjectCard = ({ project }) => {
  return (
    <div className="glass-card rounded-xl p-6 hover:scale-105 transition-all duration-300 group">
      <div className="relative overflow-hidden rounded-lg mb-4">
        <img
          src={project.covers?.['404'] || project.covers?.original || '/api/placeholder/400/300'}
          alt={project.name}
          className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="flex items-center gap-2 text-white text-sm">
            <Eye size={16} />
            <span>{project.stats?.views || 0}</span>
            <Heart size={16} />
            <span>{project.stats?.appreciations || 0}</span>
          </div>
        </div>
      </div>
      <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-cyan-400 transition-colors">
        {project.name}
      </h3>
      <p className="text-gray-400 text-sm mb-4 line-clamp-3">
        {project.description || 'Creative design project showcasing innovative visual solutions.'}
      </p>
      <div className="flex flex-wrap gap-2 mb-4">
        {project.fields?.map((field, index) => (
          <span
            key={index}
            className="px-2 py-1 text-xs bg-cyan-500/20 text-cyan-300 rounded-full border border-cyan-500/30"
          >
            {field}
          </span>
        ))}
      </div>
      <a
        href={project.url}
        target="_blank"
        rel="noopener noreferrer"
        className="glass-button inline-flex items-center gap-2 px-4 py-2 rounded-lg text-cyan-300 text-sm font-medium"
      >
        View Project <ExternalLink size={16} />
      </a>
    </div>
  );
};

const App = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadProjects = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Extract username from the Behance URL
      const username = 'haitham-design'; // From https://www.behance.net/haitham-design
      
      const projectsData = await behanceApi.fetchUserProjects(username);
      setProjects(projectsData);
    } catch (err) {
      console.error('Failed to load projects:', err);
      setError('Failed to load projects. Showing sample work.');
      
      // Fallback to mock data
      setProjects(behanceApi.getMockProjects());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  return (
    <div className="min-h-screen animated-bg text-white relative overflow-x-hidden">
      <FloatingParticles />
      
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass p-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="text-2xl font-bold text-cyan-400">Haitham Design</div>
          <div className="hidden md:flex space-x-8">
            <a href="#home" className="hover:text-cyan-400 transition-colors">Home</a>
            <a href="#projects" className="hover:text-cyan-400 transition-colors">Projects</a>
            <a href="#contact" className="hover:text-cyan-400 transition-colors">Contact</a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" className="min-h-screen flex items-center justify-center px-4 pt-20">
        <div className="max-w-4xl mx-auto text-center">
          <div className="glass-card rounded-2xl p-8 md:p-12">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white to-cyan-400 bg-clip-text text-transparent">
              Creative Designer
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8 leading-relaxed">
              Crafting exceptional digital experiences through innovative design solutions. 
              Specializing in brand identity, UI/UX design, and visual storytelling.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="#projects"
                className="glass-button px-8 py-3 rounded-lg text-cyan-300 font-medium inline-flex items-center justify-center gap-2"
              >
                View My Work
              </a>
              <a
                href="#contact"
                className="glass-button px-8 py-3 rounded-lg text-cyan-300 font-medium inline-flex items-center justify-center gap-2"
              >
                Get In Touch
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
              Featured Projects
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-6">
              Explore my latest work from Behance, showcasing creative solutions across various design disciplines.
            </p>
            {error && (
              <div className="glass-card rounded-lg p-4 max-w-md mx-auto mb-6">
                <p className="text-yellow-400 text-sm mb-2">{error}</p>
                <button
                  onClick={loadProjects}
                  className="glass-button px-4 py-2 rounded-lg text-cyan-300 text-sm font-medium inline-flex items-center gap-2"
                >
                  <RefreshCw size={16} />
                  Retry
                </button>
              </div>
            )}
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="glass-card rounded-lg p-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400 mx-auto"></div>
                <p className="text-center mt-4 text-gray-400">Loading projects...</p>
              </div>
            </div>
          ) : error ? (
            <div className="text-center py-20">
              <div className="glass-card rounded-lg p-8 max-w-md mx-auto">
                <p className="text-red-400 mb-4">Error loading projects</p>
                <p className="text-gray-400">{error}</p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {projects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <a
              href="https://www.behance.net/haitham-design"
              target="_blank"
              rel="noopener noreferrer"
              className="glass-button px-8 py-3 rounded-lg text-cyan-300 font-medium inline-flex items-center gap-2"
            >
              View All Projects on Behance <ExternalLink size={20} />
            </a>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
            Let's Work Together
          </h2>
          <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto">
            Ready to bring your vision to life? Get in touch and let's create something amazing together.
          </p>
          
          <div className="glass-card rounded-2xl p-8 md:p-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <a
                href="mailto:contact@haithamdesign.com"
                className="glass-button p-6 rounded-xl flex flex-col items-center gap-4 group"
              >
                <Mail size={32} className="text-cyan-400 group-hover:scale-110 transition-transform" />
                <div>
                  <h3 className="font-semibold text-white mb-1">Email</h3>
                  <p className="text-gray-400 text-sm">contact@haithamdesign.com</p>
                </div>
              </a>
              
              <a
                href="https://github.com/haitham-design"
                target="_blank"
                rel="noopener noreferrer"
                className="glass-button p-6 rounded-xl flex flex-col items-center gap-4 group"
              >
                <Github size={32} className="text-cyan-400 group-hover:scale-110 transition-transform" />
                <div>
                  <h3 className="font-semibold text-white mb-1">GitHub</h3>
                  <p className="text-gray-400 text-sm">@haitham-design</p>
                </div>
              </a>
              
              <a
                href="https://linkedin.com/in/haitham-design"
                target="_blank"
                rel="noopener noreferrer"
                className="glass-button p-6 rounded-xl flex flex-col items-center gap-4 group"
              >
                <Linkedin size={32} className="text-cyan-400 group-hover:scale-110 transition-transform" />
                <div>
                  <h3 className="font-semibold text-white mb-1">LinkedIn</h3>
                  <p className="text-gray-400 text-sm">@haitham-design</p>
                </div>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-white/10">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-gray-400">
            © 2024 Haitham Design. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default App;

