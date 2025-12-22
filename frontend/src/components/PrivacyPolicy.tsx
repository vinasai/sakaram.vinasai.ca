import React from 'react';
import Header from './Header';
import Footer from './Footer';

export default function PrivacyPolicy() {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Header />
            <div className="flex-grow pt-32 pb-20">
                <div className="container mx-auto px-4 max-w-4xl">
                    <div className="bg-white rounded-2xl shadow-sm p-8 md:p-12 mb-8">
                        <h1 className="text-4xl font-bold text-gray-800 mb-2">Privacy Policy</h1>
                        <p className="text-gray-500 mb-8">Last updated: {new Date().toLocaleDateString()}</p>

                        <div className="prose prose-emerald max-w-none text-gray-600">
                            <p className="lead text-lg mb-6">
                                At Sakaram Tours, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or use our services.
                            </p>

                            <h2 className="text-2xl font-bold text-gray-800 mt-8 mb-4">1. Information We Collect</h2>
                            <p>
                                We may collect information about you in a variety of ways. The information we may collect on the Site includes:
                            </p>
                            <ul className="list-disc pl-5 space-y-2 mb-6">
                                <li><strong>Personal Data:</strong> Personally identifiable information, such as your name, shipping address, email address, and telephone number, that you voluntarily give to us when you register with the Site or when you choose to participate in various activities related to the Site.</li>
                                <li><strong>Derivative Data:</strong> Information our servers automatically collect when you access the Site, such as your IP address, your browser type, your operating system, your access times, and the pages you have viewed directly before and after accessing the Site.</li>
                            </ul>

                            <h2 className="text-2xl font-bold text-gray-800 mt-8 mb-4">2. Use of Your Information</h2>
                            <p>
                                Having accurate information about you permits us to provide you with a smooth, efficient, and customized experience. Specifically, we may use information collected about you via the Site to:
                            </p>
                            <ul className="list-disc pl-5 space-y-2 mb-6">
                                <li>Create and manage your account.</li>
                                <li>Process your reservations and payments.</li>
                                <li>Email you regarding your account or order.</li>
                                <li>Fulfill and manage purchases, orders, payments, and other transactions related to the Site.</li>
                                <li>Respond to product and customer service requests.</li>
                            </ul>

                            <h2 className="text-2xl font-bold text-gray-800 mt-8 mb-4">3. Disclosure of Your Information</h2>
                            <p>
                                We may share information we have collected about you in certain situations. Your information may be disclosed as follows:
                            </p>
                            <ul className="list-disc pl-5 space-y-2 mb-6">
                                <li><strong>By Law or to Protect Rights:</strong> If we believe the release of information about you is necessary to respond to legal process, to investigate or remedy potential violations of our policies, or to protect the rights, property, and safety of others, we may share your information as permitted or required by any applicable law, rule, or regulation.</li>
                                <li><strong>Third-Party Service Providers:</strong> We may share your information with third parties that perform services for us or on our behalf, including payment processing, data analysis, email delivery, hosting services, customer service, and marketing assistance.</li>
                            </ul>

                            <h2 className="text-2xl font-bold text-gray-800 mt-8 mb-4">4. Security of Your Information</h2>
                            <p className="mb-6">
                                We use administrative, technical, and physical security measures to help protect your personal information. While we have taken reasonable steps to secure the personal information you provide to us, please be aware that despite our efforts, no security measures are perfect or impenetrable, and no method of data transmission can be guaranteed against any interception or other type of misuse.
                            </p>

                            <h2 className="text-2xl font-bold text-gray-800 mt-8 mb-4">5. Contact Us</h2>
                            <p>
                                If you have questions or comments about this Privacy Policy, please contact us at:
                            </p>
                            <p className="font-semibold text-emerald-600 mt-2">sakaramtours@gmail.com</p>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}
