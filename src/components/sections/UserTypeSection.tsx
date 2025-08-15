"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

export default function UserTypeSection() {
  const userTypes = [
    {
      title: "For Creators",
      subtitle: "Monetize Your Face",
      description: "Become an AI model and earn money every time brands use your digital likeness in their campaigns.",
      image: "/assets/gallery/ydAiEgEy97IirXF66ych-7wP4ZQ.webp",
      features: [
        "Upload your photos and create your AI model",
        "Earn commission from every usage",
        "Connect with global brands",
        "Detailed analytics and reporting"
      ],
      cta: "Become a Creator",
      href: "/auth/sign-up?type=creator",
      gradient: "from-orange-500 to-orange-600"
    },
    {
      title: "For Businesses", 
      subtitle: "Transform Your Products",
      description: "Access thousands of AI models to create professional product photos that drive sales.",
      image: "/assets/gallery/XRGSA2yky9adhJCqjUkvbA.jpg",
      features: [
        "Work with thousands of AI models",
        "Create professional product photos",
        "Team collaboration and sharing",
        "Enterprise support and features"
      ],
      cta: "Start for Business",
      href: "/auth/sign-up?type=business",
      gradient: "from-primary to-purple-600"
    }
  ];

  return (
    <section className="w-full bg-background py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
            Two Worlds, One Platform
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto font-medium">
            Whether you&apos;re a creator looking to monetize your likeness or a business seeking professional product photography
          </p>
        </motion.div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {userTypes.map((type, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-card rounded-2xl border border-border overflow-hidden hover:shadow-xl transition-all duration-300 hover:border-primary/20 group"
            >
              {/* Image */}
              <div className="aspect-[16/9] bg-muted overflow-hidden">
                <img
                  src={type.image}
                  alt={type.title}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    const parent = target.parentElement;
                    if (parent) {
                      parent.innerHTML = '<div class="flex items-center justify-center h-full text-muted-foreground">Image</div>';
                    }
                  }}
                />
              </div>

              {/* Content */}
              <div className="p-8">
                {/* Badge */}
                <div className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-4">
                  {type.title}
                </div>

                {/* Title & Description */}
                <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-3">
                  {type.subtitle}
                </h3>
                <p className="text-muted-foreground text-base md:text-lg leading-relaxed mb-6">
                  {type.description}
                </p>

                {/* Features List */}
                <ul className="space-y-3 mb-8">
                  {type.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <svg
                        className="w-5 h-5 text-primary mt-0.5 flex-shrink-0"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      <span className="text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA Button */}
                <Link href={type.href}>
                  <button className={`w-full bg-gradient-to-r ${type.gradient} text-white font-semibold py-4 px-6 rounded-xl hover:opacity-90 transition-opacity`}>
                    {type.cta}
                  </button>
                </Link>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 text-center"
        >
          {[
            { value: "500+", label: "Active Creators" },
            { value: "10K+", label: "Businesses" },
            { value: "1M+", label: "Images Generated" },
            { value: "95%", label: "Customer Satisfaction" }
          ].map((stat, index) => (
            <div key={index}>
              <div className="text-3xl md:text-4xl font-bold text-foreground mb-2">
                {stat.value}
              </div>
              <div className="text-muted-foreground text-sm md:text-base">
                {stat.label}
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}