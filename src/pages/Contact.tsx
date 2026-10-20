import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { PublicFooter, PublicNavbar } from "../components/public/PublicLayout";

export default function Contact() {
  return (
    <div className="min-h-screen bg-surface selection:bg-primary-container selection:text-on-surface">
      <PublicNavbar />
      <main className="py-24 px-6 md:px-20">
        <div className="max-w-3xl mx-auto">
          <span className="label-md text-primary mb-4 block">Get in Touch</span>
          <h1 className="font-serif text-4xl md:text-5xl text-on-surface mb-12">
            Connect with <br />
            <em className="italic text-primary">the sanctuary</em>
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <p className="text-on-surface-variant leading-relaxed mb-6">
                Whether you have a question about Google services integration,
                privacy, need technical support, or want to share feedback, we're
                here to help.
              </p>
              <div className="space-y-4">
                <div className="flex flex-col">
                  <span className="label-md text-[0.6rem] text-outline-variant mb-1">
                    Direct Developer & Inquiries
                  </span>
                  <a
                    href="mailto:amit@devamit.co.in"
                    className="font-serif text-lg text-primary hover:underline"
                  >
                    amit@devamit.co.in
                  </a>
                </div>
                <div className="flex flex-col">
                  <span className="label-md text-[0.6rem] text-outline-variant mb-1">
                    Architect
                  </span>
                  <p className="font-serif text-lg text-on-surface">
                    Amit Chakraborty (@devamitch)
                  </p>
                </div>
                <div className="flex flex-col">
                  <span className="label-md text-[0.6rem] text-outline-variant mb-1">
                    Ecosystem
                  </span>
                  <p className="text-sm text-on-surface-variant">
                    Setu Ecosystem Family (BlinkQuest, Setu, Neev)
                  </p>
                </div>
              </div>
            </div>

            <Card className="p-8 bg-surface-container-low border-none shadow-none overlap-plane">
              <form className="space-y-6">
                <div>
                  <label className="label-md text-[0.6rem] text-outline-variant mb-2 block">
                    Name
                  </label>
                  <Input
                    placeholder="Your name"
                    className="bg-surface border-none placeholder:italic placeholder:font-serif focus:bg-surface-container-lowest transition-colors"
                  />
                </div>
                <div>
                  <label className="label-md text-[0.6rem] text-outline-variant mb-2 block">
                    Email
                  </label>
                  <Input
                    type="email"
                    placeholder="Your email address"
                    className="bg-surface border-none placeholder:italic placeholder:font-serif focus:bg-surface-container-lowest transition-colors"
                  />
                </div>
                <div>
                  <label className="label-md text-[0.6rem] text-outline-variant mb-2 block">
                    Message
                  </label>
                  <Textarea
                    placeholder="How can we help?"
                    className="bg-surface border-none placeholder:italic placeholder:font-serif focus:bg-surface-container-lowest transition-colors min-h-[120px]"
                  />
                </div>
                <Button variant="primary" className="w-full transition-colors">
                  Send Message
                </Button>
              </form>
            </Card>
          </div>
        </div>
      </main>
      <PublicFooter />
    </div>
  );
}
