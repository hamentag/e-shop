// src/components/PrivacyPolicy.jsx

import React from "react";

const PrivacyPolicy = () => {
  return (
    <div className="container my-5 py-4 bg-light rounded shadow-sm">
      <h4 className="mb-4 text-center">Privacy Policy</h4>
      <p><strong>Last updated:</strong> July 27, 2025</p>

      <p>
        E-Shop ("we", "our", or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your personal information when you visit our website or use our services. Please read this policy carefully.
      </p>

      <h6 className="mt-4">1. Information We Collect</h6>
      <h6>a. Personal Information</h6>
      <ul>
        <li>Name</li>
        <li>Shipping address</li>
        <li>Email address</li>
        <li>Phone number</li>
        <li>Payment details (processed via PayPal)</li>
      </ul>
      <h6>b. Device and Usage Data</h6>
      <ul>
        <li>IP address</li>
        <li>Browser type</li>
        <li>Operating system</li>
        <li>Pages visited, time spent, clicks, referring pages</li>
      </ul>

      <h6 className="mt-4">2. How We Use Your Information</h6>
      <ul>
        <li>Process and fulfill your orders</li>
        <li>Provide customer support</li>
        <li>Communicate order confirmations or updates</li>
        <li>Analyze usage through tools like Google Analytics</li>
        <li>Prevent fraud and improve website security</li>
      </ul>
      <div className="alert alert-info">
        <strong>Note:</strong> We do <u>not</u> send marketing emails.
      </div>

      <h6 className="mt-4">3. Sharing Your Information</h6>
      <p>We do <strong>not sell</strong> your personal data. We only share it with trusted third-party services necessary to operate our business:</p>
      <ul>
        <li><strong>PayPal</strong> – for secure payment processing</li>
        <li><strong>Shippo</strong> – for shipping logistics and tracking</li>
        <li><strong>Google Analytics</strong> – to improve user experience and site performance</li>
      </ul>

      <h6 className="mt-4">4. Your Rights and Choices</h6>
      <p>You may have rights to:</p>
      <ul>
        <li>Access or request deletion of your data</li>
        <li>Correct inaccurate personal data</li>
        <li>Object to certain data uses</li>
        <li>Withdraw consent for data processing</li>
      </ul>
      <p>To exercise your rights, contact us at:</p>
      <ul>
        <li>📧 <a href="mailto:eshop-amentag@gmail.com">eshop-amentag@gmail.com</a></li>
        <li>📧 Privacy concerns: <a href="mailto:hamentag1@gmail.com">hamentag1@gmail.com</a></li>
      </ul>

      <h6 className="mt-4">5. Cookies and Tracking Technologies</h6>
      <p>We use cookies to improve your experience and collect anonymous usage statistics through Google Analytics. You can manage or disable cookies in your browser settings.</p>

      <h6 className="mt-4">6. Data Retention</h6>
      <p>We retain your information as long as necessary to:</p>
      <ul>
        <li>Complete transactions</li>
        <li>Provide services</li>
        <li>Fulfill legal obligations</li>
      </ul>
      <p>Once no longer needed, your data is securely deleted or anonymized.</p>

      <h6 className="mt-4">7. Children's Privacy</h6>
      <p>Our services are <strong>not intended for children under 13</strong>. If we inadvertently collect data from children, contact us immediately.</p>

      <h6 className="mt-4">8. Data Security</h6>
      <p>We use administrative, technical, and physical safeguards to protect your data, including SSL encryption and secure payment gateways.</p>

      <h6 className="mt-4">9. Changes to This Privacy Policy</h6>
      <p>We may update this Privacy Policy from time to time. Any changes will be posted on this page with a new “last updated” date.</p>

      <h6 className="mt-4">10. Contact Us</h6>
      <p>If you have questions or concerns:</p>
      <ul>
        <li>📧 General: <a href="mailto:eshop-amentag@gmail.com">eshop-amentag@gmail.com</a></li>
        <li>📧 Privacy: <a href="mailto:hamentag1@gmail.com">hamentag1@gmail.com</a></li>
      </ul>
    </div>
  );
};

export default PrivacyPolicy;
