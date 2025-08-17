import { createRoot } from 'react-dom/client'
import React from 'react'
import './index.css'

// Temporary working version based on production site structure
const WorkingApp = () => {
  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-8">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold text-primary mb-4">
            Ouribadah
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            Connecting Worship, Community, and Daily Life
          </p>
          <p className="text-lg">
            Your comprehensive Islamic companion for prayer times, Qibla direction, mosque finder, and community connection.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="text-center p-6 border rounded-lg">
            <div className="text-3xl font-bold text-primary">100K+</div>
            <div className="text-muted-foreground">Muslims</div>
          </div>
          <div className="text-center p-6 border rounded-lg">
            <div className="text-3xl font-bold text-primary">50K+</div>
            <div className="text-muted-foreground">Mosques</div>
          </div>
          <div className="text-center p-6 border rounded-lg">
            <div className="text-3xl font-bold text-primary">95%</div>
            <div className="text-muted-foreground">Accuracy</div>
          </div>
          <div className="text-center p-6 border rounded-lg">
            <div className="text-3xl font-bold text-primary">24/7</div>
            <div className="text-muted-foreground">Support</div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="p-6 border rounded-lg">
            <h2 className="text-2xl font-semibold mb-4">Prayer Times</h2>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Fajr</span>
                <span className="font-mono">06:05 AM</span>
              </div>
              <div className="flex justify-between">
                <span>Sunrise</span>
                <span className="font-mono">07:30 AM</span>
              </div>
              <div className="flex justify-between">
                <span>Dhuhr</span>
                <span className="font-mono">12:45 PM</span>
              </div>
              <div className="flex justify-between">
                <span>Asr</span>
                <span className="font-mono">03:20 PM</span>
              </div>
              <div className="flex justify-between">
                <span>Maghrib</span>
                <span className="font-mono">06:15 PM</span>
              </div>
              <div className="flex justify-between">
                <span>Isha</span>
                <span className="font-mono">07:45 PM</span>
              </div>
            </div>
          </div>

          <div className="p-6 border rounded-lg">
            <h2 className="text-2xl font-semibold mb-4">Qibla Direction</h2>
            <div className="text-center">
              <div className="w-32 h-32 mx-auto border-2 border-primary rounded-full flex items-center justify-center mb-4">
                <div className="text-2xl">🧭</div>
              </div>
              <p className="text-lg font-semibold">Northeast (42°)</p>
              <p className="text-sm text-muted-foreground">Getting location...</p>
            </div>
          </div>
        </div>

        <div className="text-center mt-12">
          <h3 className="text-xl font-semibold mb-4">Share Ouribadah</h3>
          <p className="text-muted-foreground mb-6">Help others discover our Islamic community</p>
          
          <div className="flex flex-wrap justify-center gap-4">
            <a href="https://www.facebook.com/sharer/sharer.php?u=https%3A%2F%2Fouribadah.com%2F" 
               className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
               target="_blank" rel="noopener noreferrer">
              Share on Facebook
            </a>
            <a href="https://twitter.com/intent/tweet?url=https%3A%2F%2Fouribadah.com%2F&text=Discover%20Ouribadah" 
               className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800 transition-colors"
               target="_blank" rel="noopener noreferrer">
              Share on X
            </a>
            <a href="https://api.whatsapp.com/send?text=Discover%20Ouribadah%20https%3A%2F%2Fouribadah.com%2F" 
               className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
               target="_blank" rel="noopener noreferrer">
              Share on WhatsApp
            </a>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-16 pt-8 border-t">
          <div className="text-center space-y-4">
            <h4 className="text-lg font-semibold">Ouribadah</h4>
            <p className="text-muted-foreground">Connecting Worship, Community, and Daily Life</p>
            <div className="flex justify-center space-x-6 text-sm">
              <a href="/privacy-policy" className="text-primary hover:underline">Privacy Policy</a>
              <a href="/terms-of-service" className="text-primary hover:underline">Terms of Service</a>
              <a href="/contact-us" className="text-primary hover:underline">Contact Us</a>
            </div>
          </div>
        </footer>
      </main>
    </div>
  )
}

createRoot(document.getElementById("root")!).render(<WorkingApp />);
