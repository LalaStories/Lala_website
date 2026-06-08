import React from "react";
import type { Metadata } from "next";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import StarBackground from "@/components/common/StarBackground";

export const metadata: Metadata = {
  title: "Terms of Use — Lala Stories",
  description:
    "Read the Lala Stories Terms of Use — the conditions governing your access to and use of the Lala Stories audio storytelling service.",
  alternates: {
    canonical: "https://lalastories.com/terms",
  },
};

export default function Terms() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Terms of Use — Lala Stories",
    "url": "https://lalastories.com/terms",
    "publisher": {
      "@type": "Organization",
      "name": "Lala Stories",
      "url": "https://lalastories.com"
    }
  };

  interface Clause {
    id: string;
    text: string;
    list?: string[];
    highlight?: string;
    alpha?: { label: string; text: string }[];
  }

  interface Section {
    num: number;
    title: string;
    clauses: Clause[];
  }

  const sections: Section[] = [
    {
      num: 1,
      title: "Age Limit and Account Eligibility",
      clauses: [
        {
          id: "1.1",
          text: "To be eligible to enter into these Terms and set up an account with Lala Stories You must:",
          alpha: [
            { label: "a", text: "Be at least eighteen (18) years old and/or otherwise have authorization and legal power to enter into this agreement by law in the country where the Service is made available to You;" },
            { label: "b", text: "Agree to be bound by these Terms." }
          ]
        },
        {
          id: "1.2",
          text: "You must also provide Lala Stories with correct information about yourself when registering an account and provide correct contact details. Agreeing to the Terms and providing such information is a requirement for your access to and use of the Service. If You do not agree to the Terms You may neither use the Service nor consume any Content provided in the Service."
        }
      ]
    },
    {
      num: 2,
      title: "The Service",
      clauses: [
        {
          id: "2.1",
          text: "Lala Stories provides a service through which You as a Subscriber can stream content to your mobile phone or via other internet-accessible devices accessed via the Lala Stories app. The Service may only be used for your non-commercial personal use in accordance with the Terms."
        },
        {
          id: "2.2",
          text: "In order to use the Service, You must use an internet-connected device compatible with Lala Stories' technical requirements. Lala Stories reserves the right to modify technical requirements from time to time and will use its best efforts to notify You via email or push notification of any modifications that may limit your technical ability to use the Service. Lala Stories also reserves the right, at any time, to add or remove a business partner and payment solution without prior notification."
        }
      ]
    },
    {
      num: 3,
      title: "Subscription Plans",
      clauses: [
        {
          id: "3.1",
          text: "Lala Stories reserves the right, at its sole discretion, to offer the Service through different kinds of subscription plans, which could include but are not limited to: promotional plans, plans provided by (or bundled with) third parties, or plans based on limitations in the Content provided."
        },
        {
          id: "3.2",
          text: "Lala Stories reserves the right, at its own discretion, to add new plans, remove existing plans or change any features or functionalities of such subscription plans from time to time."
        }
      ]
    },
    {
      num: 4,
      title: "Intellectual Property Rights",
      clauses: [
        {
          id: "4.1",
          text: "The Service is our copyrighted property and contains the copyrighted property of our licensors or licensees. All trademarks, service marks, trade names, trade dress and other intellectual property rights in the Service or in the Content are owned by us or our licensors, licensees or affiliated companies. Except as specifically agreed in writing, no element of the Service or its content may be used or exploited in any way other than as part of the Service offered to You under the Terms. We do not transfer rights or title to any portion of the Service or Content to You. Nothing provided by any brand owned or licensed by Lala Stories should be construed as granting any license or right of use of any trademark displayed on or within the Service."
        }
      ]
    },
    {
      num: 5,
      title: "Content and Software License",
      clauses: [
        {
          id: "5.1",
          text: "We hereby grant You a limited, revocable, non-exclusive, non-sublicensable, non-transferable license to access and use the Service software, its content, virtual items, or other material for your personal, non-commercial use only."
        },
        {
          id: "5.2",
          text: "You acknowledge, warrant and agree that You, or anyone to whom You allow access to the Service via your account, will not copy, reproduce, duplicate, modify, create derivative works from, display, publish, distribute, broadcast, transmit, sell, rent, lease, lend, sub-license, or otherwise exploit for any purpose (commercial or otherwise) any material and/or part of the Service to any third party without the express prior written consent of Lala Stories."
        },
        {
          id: "5.3",
          text: "You also acknowledge, warrant and agree that You, or anyone to whom You allow access to the Service via your account, will not:",
          list: [
            "Redistribute, circumvent or disable any content protection system or digital rights management technology used in the Service;",
            "Decompile, reverse engineer, disassemble or otherwise reduce any Service to a human-readable form;",
            "Remove any identification, copyright or other proprietary notices;",
            "Access or use the Service in an unlawful or unauthorized manner or in a manner that suggests an association with our products, services or brands."
          ]
        },
        {
          id: "5.4",
          text: "This section also applies to everyone who has access to the Service."
        }
      ]
    },
    {
      num: 6,
      title: "Third-Party Content and Links",
      clauses: [
        {
          id: "6.1",
          text: "The appearance of external hyperlinks and/or other elements generated by third parties accessible from the Service does not constitute endorsement by Lala Stories of the opinions or views expressed by such third parties. Lala Stories does not verify, endorse or take responsibility for the accuracy, completeness or quality of the content on these third parties' sites. Lala Stories will under no circumstances be liable for any direct or indirect loss or damage caused by the exhibition, distribution or exploitation of any information or content contained within these third-party hyperlinked websites."
        },
        {
          id: "6.2",
          text: "The Service may integrate, be integrated into, or be provided in connection with third-party services and content. Lala Stories does not control those third-party services or their content. You should carefully read any agreement or terms of use and privacy policies that apply to such third-party services."
        }
      ]
    },
    {
      num: 7,
      title: "Lala Stories' Rights and Responsibilities",
      clauses: [
        {
          id: "7.1",
          text: "As part of providing the Service, Lala Stories may contact You by mail, telephone, SMS, MMS, e-mail or directly via the Service for the purpose of communicating regarding the functionalities and the Content of the Service."
        },
        {
          id: "7.2",
          text: "If You have separately agreed and accepted thereto, Lala Stories may also contact You via other means of communication, e.g. via third-party social media platforms."
        },
        {
          id: "7.3",
          text: "All communication between Lala Stories and the Subscriber shall be in accordance with Lala Stories' Privacy Policy."
        },
        {
          id: "7.4",
          text: "Lala Stories is not liable for any disruption to mobile networks or in the service of internet providers."
        },
        {
          id: "7.5",
          text: "The Service is available around the clock, seven (7) days a week. However, Lala Stories provides no guarantee that the Service will always be free of errors or interruptions. Lala Stories also has the right, within reason, to close the Service temporarily, for example, for carrying out upgrades and maintenance."
        },
        {
          id: "7.6",
          text: "Lala Stories has the right, fully or partly, to transfer its rights and obligations under the Terms to third parties, and may engage subcontractors to carry out its obligations. Any such changes affecting the processing of your personal data shall be handled in accordance with the Lala Stories Privacy Policy."
        },
        {
          id: "7.7",
          text: "Lala Stories may, at its own discretion, make changes to the Terms. When material changes are made to your detriment, Lala Stories will communicate this to You no later than ten (10) days before the changes take effect. In some cases Lala Stories will ask for your explicit consent; in others your continued use of the Service will constitute acceptance of the changes.",
          highlight: "If at any time You wish to discontinue using the Service due to changes in the Terms, You may terminate your subscription at any time."
        }
      ]
    },
    {
      num: 8,
      title: "The Subscriber's Rights and Responsibilities",
      clauses: [
        {
          id: "8.1",
          text: "Unless otherwise stated in supplemental terms, the Subscriber may listen to Content in the Service for private non-commercial use only. Users may not play Content for an audience or in a public place. Your account details (including login credentials) are personal and may not be shared with others."
        },
        {
          id: "8.2",
          text: "The Subscriber undertakes not to circumvent or attempt to circumvent the technical or other limitations in place to prevent copying of Content in the Service and not to copy, either in whole or in part, any content in the Service, even for private use."
        },
        {
          id: "8.3",
          text: "You acknowledge and agree that your access to and use of the Service shall comply with the Terms, and the same applies to everyone to whom You allow access to the Service via your account."
        },
        {
          id: "8.4",
          text: "You are responsible for ensuring that the information provided at registration is correct and that any personal data provided to Lala Stories — including your e-mail address — is kept up to date. Any e-mail that Lala Stories sends to your e-mail address shall be deemed received by You within two (2) days of the e-mail being sent."
        },
        {
          id: "8.5",
          text: "You are responsible for maintaining control over your account to prevent undue access to the Service and undertake not to reveal your password or any other personalized details associated with your account."
        },
        {
          id: "8.6",
          text: "In any reviews of content that the Subscriber writes, the Subscriber is responsible for ensuring that opinions are expressed in accordance with applicable laws and with respect to others, and that the Subscriber does not use words or phrases that may be perceived as discriminatory or unnecessarily offensive. The Subscriber must not post, use or share intellectual property belonging to a third party or post content that is illegal, defamatory, or hateful. If the Subscriber fails to carry out the responsibilities under these Terms, Lala Stories has the right to terminate the subscription and user account."
        },
        {
          id: "8.7",
          text: "The Subscriber has no right to transfer his/her rights and obligations under the Terms unless the Subscriber has Lala Stories' written consent to do so."
        },
        {
          id: "8.8",
          text: "The Subscriber must not use the Service in any way that causes, or is likely to cause, the Service to be interrupted, damaged or impaired. You understand that You, and not Lala Stories, are responsible for all electronic communications and content sent from your device to us. You must use the Service for lawful purposes only and must not use it for any fraudulent purposes or in connection with a criminal offense or other unlawful activity."
        },
        {
          id: "8.9",
          text: "In the event that the Service, or parts thereof, is incorrect or faulty, You are urged to contact Lala Stories from the email address registered to your account or by using any other available means."
        }
      ]
    },
    {
      num: 9,
      title: "Contracting Party",
      clauses: [
        {
          id: "9.1",
          text: "The Service is provided and made available to You by Funfeed Global Private Limited, a private limited liability company incorporated in India with corporate identity number U72900KL2020PTC065725, registered at Manjunivas, 48/1961 Sahakarana Road, Vyttila, Ernakulam, Kerala 682019. To contact us or our customer service department, please send an e-mail to support@lalastories.com."
        }
      ]
    },
    {
      num: 10,
      title: "Miscellaneous",
      clauses: [
        {
          id: "10.1",
          text: "The Service is provided to You solely for the non-commercial purpose of consuming entertainment, information and other similar purposes."
        },
        {
          id: "10.2",
          text: "The Terms shall be governed and construed in accordance with the laws of India, excluding its conflict of laws principles."
        },
        {
          id: "10.3",
          text: "In case of a dispute between Lala Stories and the Subscriber, the parties should first attempt to resolve the dispute through mediation. If the parties fail to resolve the dispute through mediation within 90 days, the dispute may be referred to the courts of competent jurisdiction in Ernakulam District, Kerala, India."
        },
        {
          id: "10.4",
          text: "If You are dissatisfied with the Service, the content available on it, or with the Terms, your sole and exclusive remedy is to discontinue accessing or using the Service."
        },
        {
          id: "10.5",
          text: "To find more information about the Service or if You need assistance with any feature or with your account please contact support@lalastories.com."
        }
      ]
    }
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />

      <div className="flex flex-col min-h-screen bg-[#FFF7F0] font-body text-gray-800">
        <Header />

        <main className="grow">
          {/* ========== HERO ========== */}
          <section className="relative pt-36 pb-20 text-center overflow-hidden bg-linear-to-b from-[#1A1040] via-[#2A1D5C] to-[#3D2A7C] text-white">
            <StarBackground count={40} />

            <div className="max-w-4xl mx-auto px-6 relative z-10 space-y-4">
              <div className="inline-flex items-center gap-1 bg-orange-500/20 text-[#FFB380] border border-orange-500/30 px-4.5 py-1.5 rounded-full text-xs font-bold font-heading">
                📋 Legal
              </div>
              <h1 className="font-heading text-3xl sm:text-4.5xl font-extrabold text-white leading-tight">
                Terms of <span className="text-[#FF7A2F]">Use</span>
              </h1>
              <p className="text-white/60 text-xs sm:text-sm font-semibold">
                Last reviewed: 14 February 2022 &nbsp;·&nbsp; Funfeed Global Private Limited
              </p>
            </div>

            {/* Wave Divider */}
            <div className="absolute bottom-[-1px] left-0 right-0 w-full z-10 pointer-events-none select-none">
              <svg viewBox="0 0 1440 80" preserveAspectRatio="none" className="w-full h-[40px] md:h-[60px]">
                <path
                  d="M0,60 C360,80 720,30 1080,60 C1260,75 1380,40 1440,60 L1440,80 L0,80 Z"
                  fill="#FFF7F0"
                />
              </svg>
            </div>
          </section>

          {/* ========== CONTENT ========== */}
          <section className="max-w-4xl mx-auto px-6 py-12 space-y-8">
            {/* Intro */}
            <div className="p-8 bg-white border-l-4 border-[#FF7A2F] rounded-2xl shadow-xs leading-relaxed text-gray-600 text-[15px] sm:text-base">
              Welcome to <strong>Lala Stories!</strong> These terms of use are important and regulate the relationship between yourself and Lala Stories and as such affect your legal rights and obligations. So please, before you enter the wonderful world of Lala Stories, take a moment and read these terms carefully.
            </div>

            {/* Important notice */}
            <div className="p-6 bg-orange-50/50 border border-orange-100 rounded-2xl flex gap-4 items-start shadow-xs">
              <span className="text-2xl select-none">⚠️</span>
              <p className="text-orange-900 text-[14px] leading-relaxed font-semibold">
                By signing up for an account, accessing and/or using the Lala Stories app or website, You are entering into a binding agreement with Lala Stories and agree to abide by these Terms of Use. If You do not agree to the Terms, You may not use the Service nor access any Content provided by Lala Stories.
              </p>
            </div>

            {/* Preamble / About */}
            <div className="p-8 sm:p-10 bg-white border border-orange-50/50 rounded-3xl shadow-sm space-y-6">
              <div className="flex items-center gap-4 border-b border-gray-100 pb-5">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-[#1A1040] to-[#2A1D5C] text-sm font-bold text-white shadow-md">
                  📖
                </div>
                <h2 className="font-heading font-bold text-base sm:text-lg text-gray-900 leading-tight">
                  About These Terms
                </h2>
              </div>
              <div className="space-y-6">
                <div className="flex gap-4 items-start">
                  <span className="bg-orange-50/70 text-[#FF7A2F] rounded-full px-2.5 py-0.5 text-[10px] font-bold font-heading shrink-0 mt-1 select-none">
                    Intro
                  </span>
                  <p className="text-gray-500 text-sm sm:text-[15px] leading-relaxed font-semibold grow">
                    Lala Stories, a venture of Funfeed Global Private Limited (hereinafter &ldquo;Lala Stories&rdquo;, &ldquo;us&rdquo;, &ldquo;our&rdquo; or &ldquo;we&rdquo;), offers a service streamed over the Internet to your mobile phone or another compatible internet-accessible device. By signing up, accessing and/or using the Lala Stories app or website, using an add-on service or otherwise accessing any Content or features provided by Lala Stories, You are entering into a binding agreement and agree to these Terms of Use. You also thereby acknowledge, agree and consent to Lala Stories processing your personal data in accordance with the <a href="/privacy" className="text-[#FF7A2F] hover:underline font-bold">Lala Stories Privacy Policy</a>.
                  </p>
                </div>
                <div className="flex gap-4 items-start">
                  <span className="bg-orange-50/70 text-[#FF7A2F] rounded-full px-2.5 py-0.5 text-[10px] font-bold font-heading shrink-0 mt-1 select-none">
                    Scope
                  </span>
                  <p className="text-gray-500 text-sm sm:text-[15px] leading-relaxed font-semibold grow">
                    These Terms of Use describe the conditions upon which the Service is available to You and supersede all prior terms and conditions previously agreed upon. Additionally, supplemental terms of use may apply to specific parts of the Service (e.g. competitions, add-on services, separate subscription plans). Any supplemental terms provided by Lala Stories are an addition to these Terms and, in the event of a conflict, will prevail over these Terms of Use.
                  </p>
                </div>
                <div className="flex gap-4 items-start">
                  <span className="bg-orange-50/70 text-[#FF7A2F] rounded-full px-2.5 py-0.5 text-[10px] font-bold font-heading shrink-0 mt-1 select-none">
                    Definition
                  </span>
                  <p className="text-gray-500 text-sm sm:text-[15px] leading-relaxed font-semibold grow">
                    These Terms of Use, the Lala Stories Privacy Policy and any additional and/or supplemental terms and conditions from Lala Stories are collectively referred to as the <strong className="text-[#E55A10] font-bold">&ldquo;Terms&rdquo;</strong>.
                  </p>
                </div>
              </div>
            </div>

            {/* Render sections */}
            {sections.map((section) => (
              <div
                key={section.num}
                className="p-8 sm:p-10 bg-white border border-orange-50/50 rounded-3xl shadow-sm space-y-6"
              >
                <div className="flex items-center gap-4 border-b border-gray-100 pb-5">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-[#FF7A2F] to-[#FFB380] text-sm font-bold text-white shadow-md shadow-orange-500/20 font-heading">
                    {section.num}
                  </div>
                  <h2 className="font-heading font-bold text-base sm:text-lg text-gray-900 leading-tight">
                    {section.title}
                  </h2>
                </div>

                <div className="space-y-6">
                  {section.clauses.map((clause) => (
                    <div key={clause.id} className="flex gap-4 items-start">
                      <span className="bg-orange-50/70 text-[#FF7A2F] rounded-full px-2.5 py-0.5 text-[10px] font-bold font-heading shrink-0 mt-1 select-none">
                        {clause.id}
                      </span>
                      <div className="space-y-4 grow">
                        <p className="text-gray-500 text-sm sm:text-[15px] leading-relaxed font-semibold">
                          {clause.text}
                        </p>
                        {clause.alpha && (
                          <ol className="space-y-3.5 pt-2">
                            {clause.alpha.map((aItem) => (
                              <li
                                key={aItem.label}
                                className="flex gap-4 items-start text-xs sm:text-sm text-gray-500 font-semibold leading-relaxed"
                              >
                                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-orange-50 text-[#FF7A2F] font-bold select-none font-heading text-xs">
                                  {aItem.label}
                                </span>
                                <p className="pt-0.5">{aItem.text}</p>
                              </li>
                            ))}
                          </ol>
                        )}
                        {clause.list && (
                          <ul className="space-y-2.5 pt-2 pl-2">
                            {clause.list.map((item, idx) => (
                              <li
                                key={idx}
                                className="flex gap-2.5 items-start text-xs sm:text-sm text-gray-500 font-semibold leading-relaxed"
                              >
                                <span className="text-[#FF7A2F] text-sm select-none shrink-0">›</span>
                                <p>{item}</p>
                              </li>
                            ))}
                          </ul>
                        )}
                        {clause.highlight && (
                          <div className="p-4 rounded-xl bg-orange-50/50 border border-orange-100/50 text-[#E55A10] text-xs sm:text-sm font-semibold">
                            {clause.highlight}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            {/* Bottom corporate details note */}
            <div className="rounded-3xl bg-linear-to-br from-[#1A1040] to-[#2A1D5C] p-8 text-white flex gap-6 items-start shadow-xl border border-white/5">
              <span className="text-4xl shrink-0">🏢</span>
              <div className="space-y-2">
                <h3 className="font-heading font-bold text-base sm:text-lg">Funfeed Global Private Limited</h3>
                <p className="text-white/70 text-xs sm:text-sm leading-relaxed font-semibold">
                  CIN: U72900KL2020PTC065725 &nbsp;·&nbsp; Email us at{" "}
                  <a href="mailto:support@lalastories.com" className="text-[#FFB380] hover:underline font-bold">
                    support@lalastories.com
                  </a>
                </p>
                <p className="text-white/40 text-[10px] sm:text-xs pt-1 font-semibold leading-relaxed border-t border-white/10 mt-2">
                  48/1961, Manjunivas, Sahakarana Road, Vytilla P.O, Cochin, Kerala &ndash; 682019, India
                </p>
              </div>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </>
  );
}
