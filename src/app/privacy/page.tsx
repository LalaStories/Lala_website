import React from "react";
import type { Metadata } from "next";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import StarBackground from "@/components/common/StarBackground";

export const metadata: Metadata = {
  title: "Privacy Policy — Lala Stories",
  description:
    "Read the Lala Stories Privacy Policy to understand how Funfeed Global Private Limited collects, stores and uses your personal data.",
  alternates: {
    canonical: "https://lalastories.com/privacy",
  },
};

export default function Privacy() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Privacy Policy — Lala Stories",
    "url": "https://lalastories.com/privacy",
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
  }

  interface Section {
    num: number;
    title: string;
    clauses: Clause[];
  }

  const sections: Section[] = [
    {
      num: 1,
      title: "General",
      clauses: [
        {
          id: "1.1",
          text: "Lala Stories, a venture of Funfeed Global Private Limited (hereinafter \"Lala Stories\", \"us\", \"our\" or \"we\"), offers an internet-based digital subscription service that gives you (hereinafter \"You\" or the \"User\") access to the Lala Stories website and other literary content on your mobile phone, tablet or other devices (the \"Service\") pursuant to the Terms of Use, this Privacy Policy and any supplemental terms and conditions which may govern your use of a specific Subscription plan for Lala Stories (the \"Terms\"). The Service is provided by Funfeed Global Pvt. Ltd., with corporate identification number U72900KL2020PTC065725."
        },
        {
          id: "1.2",
          text: "This privacy policy explains Lala Stories' practices regarding its collection, storing, use and disclosure of certain information, including your personal data in connection with our provision of the Service to You. This privacy policy also applies to persons who visit our website or download and use our application. It serves to inform You about our processing of your personal data and ensure You that your personal data is treated with respect and in accordance with the applicable data protection legislation when using the Service."
        },
        {
          id: "1.3",
          text: "You should always feel safe when sharing your personal data with Lala Stories. Lala Stories has taken the technical and organizational security measures that are appropriate to ensure that your personal data is protected from unauthorized access or disclosure, use, modification, destruction and loss. If You are not comfortable with the content in this Privacy Policy You may always refrain from using the Service."
        }
      ]
    },
    {
      num: 2,
      title: "When and From Where Does Lala Stories Collect Personal Data?",
      clauses: [
        {
          id: "2.1",
          text: "Lala Stories collects personal data about You when:",
          list: [
            "You set up an account with Lala Stories and/or use the Service.",
            "You install and/or use any application included in the Service with or without an underlying subscription plan.",
            "You visit the website.",
            "You report errors, infringing or otherwise inappropriate material or contact Lala Stories' customer services for any other reason.",
            "You link the Service to your Facebook account or a similar third-party service (e.g. to facilitate login to the Service), in which case we receive data from such third-party service.",
            "You answer a survey, including but not limited to customer satisfaction questionnaires or marketing surveys, or reply to communication from Lala Stories."
          ]
        },
        {
          id: "2.2",
          text: "Lala Stories also collects information through our own or third-party cookies and similar tracking technologies (including but not limited to beacons, tags and pixels) that may track your activities and choices when You download our application, use the Service or visit our website. This is for instance for the purposes of facilitating log-in, remembering your preferred settings, sending You tailored marketing and measuring the successfulness of advertising."
        }
      ]
    },
    {
      num: 3,
      title: "What Personal Data Does Lala Stories Collect?",
      clauses: [
        {
          id: "3.1",
          text: "When You set up an account with Lala Stories or contact Lala Stories' customer services, Lala Stories collects personal data about You. Basic user data includes your contact details such as name, e-mail address and/or phone number. Lala Stories may also collect data regarding your date of birth, gender and additional contact details such as your address. Lala Stories may also collect personal data that You provide about your family members (including names, e-mails, dates of birth and/or photos). If You choose to provide such personal data, You are responsible for having the right to do so with their consent and You should inform them about our processing activities."
        },
        {
          id: "3.2",
          text: "When You use the Service or visit Lala Stories' website and app, Lala Stories may also collect data concerning usage (such as choices of titles and search queries), viewing information (such as content viewed) and technical data (such as unique platform IDs, phone and platform versions, device IP address, Lala Stories app version, language settings, URL information, encrypted password, cookie data and browser type)."
        },
        {
          id: "3.3",
          text: "If You choose to link the Service to Facebook or a similar third-party service, Lala Stories may collect and process personal data which You have given that third party permission to share with Lala Stories. Lala Stories encourages You to inform yourself of such third parties' privacy practices."
        },
        {
          id: "3.4",
          text: "Lala Stories may also collect and process personal data that You provide in public forums on Lala Stories' website or on third-party platforms such as application stores, social networking sites, or when You link your profile on a third-party site with your personal account."
        }
      ]
    },
    {
      num: 4,
      title: "For How Long Is the Data Kept?",
      clauses: [
        {
          id: "4.1",
          text: "Lala Stories will keep your personal data only as long as it is necessary with regard to the purpose of the respective processing activity."
        },
        {
          id: "4.2",
          text: "Personal data collected and processed for marketing purposes will be stored for as long as You are a Subscriber and for twelve (12) months after your subscription has ended, unless You have given Lala Stories your consent to continue to process such data."
        },
        {
          id: "4.3",
          text: "When You contact Lala Stories to receive support or for other purposes, we will store your personal data for twenty-four (24) months after resolving your latest support ticket."
        },
        {
          id: "4.4",
          text: "Your personal data is processed for analytical purposes during your subscription period and for twenty-four (24) months thereafter."
        },
        {
          id: "4.5",
          text: "Lala Stories may store personal data for a longer time than the aforementioned periods if required by law or in order to establish, exercise or defend a right in a legal claim."
        }
      ]
    },
    {
      num: 5,
      title: "Where Is the Personal Data Stored?",
      clauses: [
        {
          id: "5.1",
          text: "Your personal data is stored on servers located in the country where the Contracting Party (as defined in the Terms of Use) is established. For international transfers, Lala Stories applies appropriate security measures as described in Section 9.5."
        }
      ]
    },
    {
      num: 6,
      title: "Why Does Lala Stories Process Your Personal Data?",
      clauses: [
        {
          id: "6.1",
          text: "Lala Stories processes your personal data for various purposes. Primarily, Lala Stories processes your personal data in order to manage the customer relationship with You and to fulfill its legal obligations. Your personal data may also be processed for market and customer analysis, market research, statistics, business monitoring and methodological development in order to develop and customize the Service and its features."
        },
        {
          id: "6.2",
          text: "Lala Stories also processes your personal data to provide better and more personalized offers and services, and to decrease the risk of sending You irrelevant advertising or marketing. Personal data may be processed, linked, segmented and analyzed in order to provide information, offers or recommendations tailored to your preferences, behaviour, needs or lifestyle via email, in-app push notifications and advertising on third-party channels. It may also be used as a basis for targeted marketing towards audiences similar to Lala Stories' existing users, including the creation of custom audiences on platforms such as Facebook and Google."
        }
      ]
    },
    {
      num: 7,
      title: "What Is the Legal Basis for the Processing?",
      clauses: [
        {
          id: "7.1",
          text: "A majority of the personal data that Lala Stories processes about You is processed because it is necessary for Lala Stories' performance of the Terms — i.e. in order to provide and administer the Service and its features, including processing your contact details such as e-mail address, phone number and information from the payment service provider."
        },
        {
          id: "7.2",
          text: "Some personal data is processed based on a balance of interest, i.e. Lala Stories' legitimate interest in processing the data outweighs the impact and risk the processing may have on your integrity. Such is the case when Lala Stories processes your personal data for support purposes or certain marketing purposes other than direct marketing, and when we store your library information after your subscription has ended."
        },
        {
          id: "7.3",
          text: "Additionally, some personal data is processed based on your consent — for example personal data obtained via your Facebook account or for direct marketing of Lala Stories' or its partners' goods and services. If You provide personal data of other natural persons, such as family members, You are responsible for ensuring they consent to the processing of their personal data."
        },
        {
          id: "7.4",
          text: "To the extent that processing is carried out with consent as a sole legal basis, it is voluntary for You to give such consent and You may at any time, wholly or partly, withdraw your consent.",
          highlight: "You have the right to withdraw your consent at any time without affecting the lawfulness of processing carried out before withdrawal."
        }
      ]
    },
    {
      num: 8,
      title: "Data Security and Integrity",
      clauses: [
        {
          id: "8.1",
          text: "The security, integrity and confidentiality of your personal data is very important to us. We have implemented technical, administrative and physical security measures designed to protect your personal data from unauthorized access or disclosure, use, modification, destruction and loss. We review our security procedures periodically to assess the need to implement additional measures or technical upgrades. Please be aware that, despite our best efforts, no security measures are impenetrable, and we ask that You inform us immediately of any suspicious activities You notice in the Service."
        }
      ]
    },
    {
      num: 9,
      title: "Who Does Lala Stories Disclose Your Personal Data To?",
      clauses: [
        {
          id: "9.1",
          text: "Lala Stories may disclose your personal data to its affiliates, business partners, suppliers and other third parties in order to fulfill the agreement with You or to fulfill agreements with Lala Stories' suppliers and business partners, or otherwise according to the purposes set out in this privacy policy."
        },
        {
          id: "9.2",
          text: "Lala Stories may also disclose your personal data to third parties for the purpose of sending You tailored advertising and marketing, measuring the success and outreach of our digital marketing and for other promotional purposes — for example when using remarketing features in Google Analytics, uploading custom audiences to Facebook or Google, or informing business partners that a marketing measure generated new customers."
        },
        {
          id: "9.3",
          text: "Lala Stories may also disclose personal data to companies that process personal data on our behalf, such as IT system providers, customer service companies and affiliates. Where personal data is disclosed to such parties, Lala Stories enters into data processing agreements with them to ensure a high level of security is maintained."
        },
        {
          id: "9.4",
          text: "Personal data may also be disclosed, if needed, to comply with statutory legal requirements or requirements from authorities or agencies, to safeguard Lala Stories' legal interests, or to detect, prevent or address fraud and other security or technical issues."
        },
        {
          id: "9.5",
          text: "As an international business, we may store your personal data on servers across India. When your personal data is transferred between different countries, such transfers are made in accordance with applicable data protection laws and to the categories of recipients and for the purposes set out in this privacy policy."
        }
      ]
    },
    {
      num: 10,
      title: "Links to External Websites",
      clauses: [
        {
          id: "10.1",
          text: "Information provided by Lala Stories may contain links to websites operated or owned by someone other than Lala Stories. Lala Stories is not responsible for the processing of personal data carried out on these websites. Lala Stories encourages You to inform yourself of the privacy practices of the respective website controllers."
        }
      ]
    },
    {
      num: 11,
      title: "Changes to the Privacy Policy",
      clauses: [
        {
          id: "11.1",
          text: "This privacy policy may be revised from time to time. If Lala Stories makes any significant changes, Lala Stories will inform You by e-mail, SMS or through the Service before the changes take effect. The most recent version of our privacy policy will also be published on Lala Stories' website. If any change requires your consent, Lala Stories will make a request for such new consent from You. We encourage You to review this privacy policy frequently in order to stay informed about our data processing practices.",
          highlight: "Last updated: January 1, 2024. For questions about this policy, please contact us through the app or website support channels."
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
                🔒 Legal
              </div>
              <h1 className="font-heading text-3xl sm:text-4.5xl font-extrabold text-white leading-tight">
                Privacy <span className="text-[#FF7A2F]">Policy</span>
              </h1>
              <p className="text-white/60 text-xs sm:text-sm font-semibold">
                Effective Date: January 1, 2024 &nbsp;·&nbsp; Funfeed Global Private Limited
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
              <strong>LALA Stories</strong>, a venture of <strong>Funfeed Global Private Limited</strong> (CIN: U72900KL2020PTC065725), is committed to protecting your privacy. This Privacy Policy explains how we collect, store, use and disclose your personal data in connection with our Service. By using the Service you acknowledge that you have read and understood this Policy.
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
              <span className="text-4xl shrink-0">🔒</span>
              <div className="space-y-2">
                <h3 className="font-heading font-bold text-base sm:text-lg">Questions about your privacy?</h3>
                <p className="text-white/70 text-xs sm:text-sm leading-relaxed font-semibold">
                  Our privacy team is dedicated to safeguarding your personal information. Reach out at{" "}
                  <a href="mailto:support@lalastories.com" className="text-[#FFB380] hover:underline font-bold">
                    support@lalastories.com
                  </a>{" "}
                  with any privacy questions.
                </p>
                <p className="text-white/40 text-[10px] sm:text-xs pt-1 font-semibold leading-relaxed">
                  Funfeed Global Private Limited &nbsp;·&nbsp; 48/1961 Sahakarana Road, Vyttila, Ernakulam, Kerala 682019, India
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
