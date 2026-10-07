import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Share2, Clock, Calendar } from 'lucide-react';
import './BlogDetail.css';

const blogPosts = [
  {
    id: '1',
    title: 'The Evolution of Minimalist Footwear',
    content: `
      <p>Minimalist footwear has evolved from a niche subculture to a dominating force in modern street style and high fashion. What began as an exercise in reductionism in the early 1980s has now become the foundation of the modern wardrobe.</p>
      
      <h3>The Origins</h3>
      <p>In the beginning, sneakers were loud, colorful, and heavily branded. The shift towards minimalism was a conscious rebellion against this maximalist approach. Designers started stripping away unnecessary panels, aggressive branding, and chunky soles to focus on the pure silhouette of the shoe.</p>
      
      <img src="/images/blog/shoes-minimalist.jpg" alt="Minimalist Shoes" class="blog-article-image" />
      
      <h3>Materials Matter</h3>
      <p>When you remove all the extra details, the quality of the materials has nowhere to hide. This is why the best minimalist footwear is often crafted from premium full-grain leathers, high-grade suedes, and advanced sustainable synthetics.</p>
      
      <h3>How to Style</h3>
      <p>The beauty of a clean sneaker is its versatility. It can effortlessly transition from a casual weekend look with denim to a more elevated aesthetic when paired with tailored trousers or a relaxed suit. The key is ensuring the rest of the outfit respects the understated nature of the footwear.</p>
    `,
    image: '/images/blog/shoes-minimalist.jpg',
    category: 'Footwear',
    author: 'Elena Rostova',
    date: 'Oct 12, 2026',
    readTime: '4 min read'
  },
  {
    id: '2',
    title: 'Integrating Smart Tech into Your Daily Routine',
    content: `
      <p>Technology should seamlessly blend into our lives, enhancing our capabilities without demanding constant attention. The latest generation of premium audio and wearable tech is achieving exactly this balance.</p>
      
      <img src="/images/blog/tech-lifestyle.jpg" alt="Tech Lifestyle" class="blog-article-image" />
      
      <h3>Audio as a Focus Tool</h3>
      <p>High-fidelity noise-canceling headphones are no longer just for audiophiles or frequent flyers. They have become essential productivity tools for the modern professional, creating isolated environments of deep focus in busy open-plan offices.</p>
      
      <h3>The Wearable Evolution</h3>
      <p>Smartwatches have moved beyond simple step counters. Today's premium wearables act as holistic health companions and subtle notification filters, allowing you to stay connected without constantly pulling out your smartphone.</p>
      
      <h3>Finding the Balance</h3>
      <p>The key to integrating tech is intentionality. Use these devices to serve your goals—whether that's tracking a marathon training block or simply blocking out the noise to read a good book.</p>
    `,
    image: '/images/blog/tech-lifestyle.jpg',
    category: 'Technology',
    author: 'Marcus Chen',
    date: 'Oct 15, 2026',
    readTime: '3 min read'
  }
];

const BlogDetail = () => {
  const { id } = useParams();
  const post = blogPosts.find(p => p.id === id);

  if (!post) {
    return (
      <div className="container" style={{ padding: '8rem 0', textAlign: 'center' }}>
        <h2>Article not found</h2>
        <Link to="/" className="btn btn-primary" style={{ marginTop: '1rem' }}>Return Home</Link>
      </div>
    );
  }

  return (
    <article className="blog-detail-page">
      <div className="blog-detail-hero" style={{ backgroundImage: `url(${post.image})` }}>
        <div className="blog-detail-overlay"></div>
        <div className="container blog-hero-top-nav">
          <Link to="/" className="blog-back-btn"><ArrowLeft size={16} /> Back</Link>
        </div>
        <div className="container blog-detail-hero-content">
          <span className="blog-detail-category">{post.category}</span>
          <h1 className="blog-detail-title">{post.title}</h1>
          <div className="blog-detail-meta">
            <span className="meta-item"><Calendar size={14} /> {post.date}</span>
            <span className="meta-item"><Clock size={14} /> {post.readTime}</span>
            <span className="meta-item">By {post.author}</span>
          </div>
        </div>
      </div>
      
      <div className="container blog-detail-content-wrapper">
        <div className="blog-detail-sidebar">
          <button className="blog-share-btn"><Share2 size={18} /> Share Article</button>
        </div>
        <div 
          className="blog-detail-body"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      </div>
    </article>
  );
};

export default BlogDetail;
