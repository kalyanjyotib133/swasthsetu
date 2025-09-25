export default function LandingFooter() {
  return (
    <footer className="bg-card border-t border-border py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center mb-4">
              <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center mr-2">
                <span className="text-primary-foreground font-bold text-xs" data-testid="logo-footer">KL</span>
              </div>
              <span className="text-lg font-semibold text-primary" data-testid="brand-footer">SwasthSetu</span>
            </div>
            <p className="text-muted-foreground text-sm" data-testid="text-footer-powered">
               Your Health, Connected<br/>
               Digital healthcare platform
             </p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-foreground transition-colors" data-testid="link-about">About</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors" data-testid="link-privacy">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors" data-testid="link-terms">Terms of Service</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Support</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-foreground transition-colors" data-testid="link-help">Help Center</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors" data-testid="link-contact">Contact Us</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors" data-testid="link-faq">FAQ</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Emergency</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>Ambulance: <a href="tel:108" className="text-destructive font-medium" data-testid="link-ambulance">108</a></li>
              <li>Police: <a href="tel:100" className="text-primary font-medium" data-testid="link-police">100</a></li>
              <li>Health Helpline: <a href="tel:104" className="text-primary font-medium" data-testid="link-health">104</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-border mt-8 pt-8 text-center text-sm text-muted-foreground" data-testid="text-copyright">
           © 2024 SwasthSetu. All rights reserved. | Developed by Kalyanjyoti Barman.
         </div>
      </div>
    </footer>
  );
}
