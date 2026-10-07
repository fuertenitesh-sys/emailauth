import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import './BlogSection.css';

const blogPosts = [
  {
    id: 1,
    title: 'The Evolution of Minimalist Footwear',
    excerpt: 'From humble beginnings in the 80s to dominating modern street style. A deep dive into how clean lines and neutral tones became the foundation of modern fashion...',
    image: '/images/blog/shoes-minimalist.jpg',
    category: 'Footwear'
  },
  {
    id: 2,
    title: 'Integrating Smart Tech into Your Daily Routine',
    excerpt: 'How the latest generation of premium audio and wearable tech is transforming productivity and lifestyle for the modern professional...',
    image: '/images/blog/tech-lifestyle.jpg',
    category: 'Technology'
  }
];

const BlogSection = () => {
  return (
    <section className="blog-section">
      <div className="container">
        <div className="blog-section-header">
          <h2 className="blog-section-title">Our blog</h2>
          <Link to="/blog" className="blog-view-all">VIEW ALL <ArrowRight size={14} /></Link>
        </div>
        
        <div className="blog-grid">
          {blogPosts.map(post => (
            <div key={post.id} className="blog-card">
              <Link to={`/blog/${post.id}`} className="blog-image-wrapper">
                <img src={post.image} alt={post.title} className="blog-image" />
              </Link>
              <div className="blog-content">
                <Link to={`/blog/${post.id}`} className="blog-title">
                  {post.title}
                </Link>
                <p className="blog-excerpt">
                  {post.excerpt}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BlogSection;
