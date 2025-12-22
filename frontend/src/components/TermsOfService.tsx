import React from 'react';
import Header from './Header';
import Footer from './Footer';

export default function TermsOfService() {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Header />
            <div className="flex-grow pt-32 pb-20">
                <div className="container mx-auto px-4 max-w-4xl">
                    <div className="bg-white rounded-2xl shadow-sm p-8 md:p-12 mb-8">
                        <h1 className="text-4xl font-bold text-gray-800 mb-2">Terms of Service</h1>
                        <p className="text-gray-500 mb-8">Last updated: {new Date().toLocaleDateString()}</p>

                        <div className="prose prose-emerald max-w-none text-gray-600">
                            <p className="lead text-lg mb-6">
                                Welcome to Sakaram Tours. By accessing our website and using our services, you agree to comply with and be bound by the following terms and conditions of use.
                            </p>

                            <h2 className="text-2xl font-bold text-gray-800 mt-8 mb-4">1. Agreement to Terms</h2>
                            <p className="mb-6">
                                These Terms of Service constitute a legally binding agreement made between you, whether personally or on behalf of an entity ("you") and Sakaram Tours ("we," "us" or "our"), concerning your access to and use of our website as well as any other media form, media channel, mobile website or mobile application related, linked, or otherwise connected thereto (collectively, the "Site"). Used appropriately.
                            </p>

                            <h2 className="text-2xl font-bold text-gray-800 mt-8 mb-4">2. Intellectual Property Rights</h2>
                            <p className="mb-6">
                                Unless otherwise indicated, the Site is our proprietary property and all source code, databases, functionality, software, website designs, audio, video, text, photographs, and graphics on the Site (collectively, the "Content") and the trademarks, service marks, and logos contained therein (the "Marks") are owned or controlled by us or licensed to us, and are protected by copyright and trademark laws.
                            </p>

                            <h2 className="text-2xl font-bold text-gray-800 mt-8 mb-4">3. Booking and Payments</h2>
                            <p className="mb-6">
                                All bookings are subject to availability and confirmation. Prices are subject to change without notice until a booking is confirmed. We reserve the right to correct any errors in pricing or tour descriptions. Payment terms will be specified at the time of booking.
                            </p>

                            <h2 className="text-2xl font-bold text-gray-800 mt-8 mb-4">4. Cancellation and Refunds</h2>
                            <p className="mb-6">
                                Cancellation policies vary depending on the specific tour or service booked. Please review the specific cancellation policy provided at the time of booking. In general, cancellations made within a certain period prior to the tour date may incur a cancellation fee.
                            </p>

                            <h2 className="text-2xl font-bold text-gray-800 mt-8 mb-4">5. Limitation of Liability</h2>
                            <p className="mb-6">
                                In no event will we or our directors, employees, or agents be liable to you or any third party for any direct, indirect, consequential, exemplary, incidental, special, or punitive damages, including lost profit, lost revenue, loss of data, or other damages arising from your use of the site, even if we have been advised of the possibility of such damages.
                            </p>

                            <h2 className="text-2xl font-bold text-gray-800 mt-8 mb-4">6. Changes to Terms</h2>
                            <p className="mb-6">
                                We reserve the right, in our sole discretion, to make changes or modifications to these Terms of Service at any time and for any reason. We will alert you about any changes by updating the "Last updated" date of these Terms of Service, and you waive any right to receive specific notice of each such change.
                            </p>

                            <h2 className="text-2xl font-bold text-gray-800 mt-8 mb-4">7. Contact Us</h2>
                            <p>
                                If you have questions or comments about these Terms of Service, please contact us at:
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
