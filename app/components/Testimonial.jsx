// /app/components/Testimonials.jsx
export default function Testimonials() {
    const testimonials = [
        { id: 1, name: 'John Doe', quote: 'Great quality — I love it!', image: 'https://images.pexels.com/photos/33295043/pexels-photo-33295043.jpeg' },
        { id: 2, name: 'Jane Smith', quote: 'Fast shipping and excellent service.', image: 'https://images.pexels.com/photos/34762961/pexels-photo-34762961.jpeg' },
        { id: 3, name: 'Bob Johnson', quote: 'Simple design, top-notch materials.', image: 'https://images.pexels.com/photos/34744907/pexels-photo-34744907.jpeg' },
    ];

    return (
        <section className="section testimonials">
            <div className="container">
                <h2 className="section-title">What customers say</h2>
                <div className="testimonials-grid">
                    {testimonials.map((t) => (
                        <blockquote key={t.id} className="testimonial-card" aria-label={`Testimonial from ${t.name}`}>
                            <p className="testimonial-quote">“{t.quote}”</p>
                            <cite className="testimonial-author">— {t.name}</cite>
                            <img src={t.image} alt={t.name} className="testimonial-image" />
                        </blockquote>
                    ))}
                </div>
            </div>
        </section>
    );
}
