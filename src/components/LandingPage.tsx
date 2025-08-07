import { motion, useScroll, useTransform } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  MessageCircle, 
  Shield, 
  Clock, 
  Users, 

} from 'lucide-react';
import DecryptedText from './DecryptedText';



export function LandingPage() {
  const navigate = useNavigate();
  const { scrollY } = useScroll();

  // Parallax transforms
  const featuresY = useTransform(scrollY, [200, 800], [0, -100]);

  return (
    <div className="h-screen bg-[#111827] text-white overflow-y-scroll snap-y snap-mandatory">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center bg-[#111827] overflow-hidden z-10 snap-start">

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Content Column */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            >
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-6">
                Chat freely, <br />
                                <DecryptedText text="without a trace." animateOn='load' className="text-transparent bg-clip-text bg-gradient-to-r from-[#2563EB] to-[#2560DF]" />
              </h1>
              <p className="text-lg md:text-xl text-gray-400 max-w-xl mb-8">
                SealTalk is a privacy-first chat platform where your messages disappear after 24 hours. No history, no logs, just secure and spontaneous conversations.
              </p>
              <div className="flex items-center gap-4">
                <motion.button
                  onClick={() => navigate('/signin')}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-3 bg-gradient-to-r from-[#2563EB] to-[#2560DF] text-white font-bold rounded-lg shadow-lg hover:shadow-blue-500/50 transition-shadow duration-300"
                >
                  Get Started
                </motion.button>
                <motion.button
                  onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-3 bg-[#1F2937] text-white font-bold rounded-lg hover:bg-gray-700 transition-colors duration-300"
                >
                  Learn More
                </motion.button>
              </div>
            </motion.div>

            {/* Interactive Element Column */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
              className="hidden lg:block bg-[#1F2937] border border-gray-800 rounded-xl p-6 shadow-lg transition-all duration-300 hover:border-blue-500/50 hover:shadow-blue-500/20 backdrop-blur-sm relative"
            >
              <div className="flex items-center mb-4">
                <img src="/avatars/seal1.png" alt="User Avatar" className="w-10 h-10 rounded-full object-cover border-2 border-blue-500 mr-4" />
                <div>
                  <h4 className="font-bold text-white">Anonymous Seal</h4>
                  <p className="text-sm text-green-400">Online</p>
                </div>
              </div>
              <div className="space-y-3 text-sm">
                <div className="bg-blue-600/80 text-white p-3 rounded-lg rounded-bl-none max-w-xs">
                  Hey! Have you heard about SealTalk? It's amazing for privacy.
                </div>
                <div className="bg-gray-700 text-white p-3 rounded-lg rounded-br-none max-w-xs ml-auto">
                  Oh really? What's so special about it?
                </div>
                <div className="bg-blue-600/80 text-white p-3 rounded-lg rounded-bl-none max-w-xs">
                  All messages are deleted after 24 hours. No trace left!
                </div>
              </div>
              <div className="flex items-center space-x-3 bg-gray-800/50 rounded-lg p-3 mt-4 border border-gray-600">
                <input 
                  type="text" 
                  placeholder="Your message disappears soon..."
                  className="flex-1 bg-transparent text-white placeholder-gray-500 outline-none text-sm"
                  disabled
                />
                <button className="bg-gradient-to-r from-[#2563EB] to-[#2560DF] p-2 rounded-lg">
                  <MessageCircle className="h-5 w-5 text-white" />
                </button>
              </div>
              {/* Floating elements */}
              <div className="absolute -top-4 -right-4 w-20 h-20 bg-blue-600/20 rounded-full blur-xl animate-pulse"></div>
              <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-blue-500/20 rounded-full blur-xl animate-pulse delay-1000"></div>
            </motion.div>
          </div>
        </div>

        {/* Background decoration */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>
      </section>

      {/* Features Section */}
      <motion.section 
        id="features"
        style={{ y: featuresY }}
        className="h-screen flex justify-center py-24 bg-[#111827] z-10 relative snap-start pt-32"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white">Why SealTalk?</h2>
            <p className="mt-4 text-xl text-gray-400">Because your privacy should never be a compromise.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "24-Hour Message Expiration",
                description: "All messages are permanently deleted after 24 hours. No archives, no backups, no exceptions.",
                icon: Clock
              },
              {
                title: "Privacy-First by Design",
                description: "We don't track you, we don't store your data. Your conversations are yours, and yours alone.",
                icon: Shield
              },
              {
                title: "Inclusive & Anonymous Access",
                description: "Join with an email, Google, or completely anonymously. Your identity is your choice.",
                icon: Users
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-gray-800/50 p-8 rounded-2xl shadow-lg border border-gray-700/50 text-center transition-all duration-300 hover:border-blue-500/50 hover:shadow-blue-500/20"
              >
                <div className="inline-block p-4 bg-blue-900/50 rounded-full mb-4">
                  <feature.icon className="w-8 h-8 text-blue-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* How It Works Section */}
            <section id="how-it-works" className="h-screen flex flex-col items-center justify-center py-24 bg-[#111827] z-10 relative snap-start">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white">How It Works</h2>
            <p className="mt-4 text-xl text-gray-400">Get started in three simple steps.</p>
          </div>
          
          <div className="relative flex flex-col gap-12">


            {[
              {
                step: "01", 
                title: "Choose Your Access",
                description: "Sign up with email, use Google, or join anonymously - whatever feels right for you.",
                icon: Users
              },
              {
                step: "02", 
                title: "Start Conversations",
                description: "Jump into real-time chat with a welcoming community. Pick your avatar and display name.",
                icon: MessageCircle
              },
              {
                step: "03",
                title: "Chat Freely",
                description: "Your messages automatically disappear after 24 hours. No permanent record, just genuine conversation.",
                icon: Clock
              }
            ].map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                viewport={{ once: true }}
                className={`flex items-center gap-8 ${index % 2 === 1 ? 'md:flex-row-reverse' : ''}`}
              >
                <div className="flex-1 text-center md:text-left">
                  <div className="flex items-center justify-center md:justify-start gap-4 mb-4">
                    <span className="text-3xl font-bold text-blue-500">{step.step}</span>
                    <step.icon className="w-8 h-8 text-blue-500" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-3">
                    {step.title}
                  </h3>
                  <p className="text-lg text-gray-400 leading-relaxed">
                    {step.description}
                  </p>
                </div>
                <div className="w-24 h-1 md:w-1 md:h-24 bg-gradient-to-r md:bg-gradient-to-b from-blue-500 to-indigo-600 rounded-full" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
            <section id="cta" className="h-screen flex flex-col justify-center py-20 bg-[#111827] text-center z-10 relative snap-start">
        <div className="max-w-4xl mx-auto text-center flex-grow flex flex-col justify-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Ready to Chat Freely?</h2>
            <p className="text-lg text-gray-400 mb-8 max-w-2xl mx-auto">
              Join SealTalk today and experience a new level of privacy and freedom in your conversations.
            </p>
            <motion.button
              onClick={() => navigate('/signin')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-10 py-4 bg-gradient-to-r from-[#2563EB] to-[#2560DF] text-white font-bold rounded-lg shadow-lg hover:shadow-blue-500/50 transition-shadow duration-300"
            >
              Get Started Now
            </motion.button>
          </motion.div>
        </div>
        <div className="pt-10 text-center text-gray-500">
          <p>&copy; {new Date().getFullYear()} SealTalk. All rights reserved.</p>
          <div className="flex justify-center gap-6 mt-4">
            <button onClick={() => navigate('/privacy')} className="hover:text-white transition-colors">Privacy Policy</button>
            <a href="mailto:hello@sealtalk.app" className="hover:text-white transition-colors">Contact</a>
          </div>
        </div>
      </section>
    </div>
  );
}
