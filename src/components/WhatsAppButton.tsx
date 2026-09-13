import WhatsAppIcon from './WhatsAppIcon';

const WhatsAppButton = () => {
  return (
    <a
      href="https://wa.me/5511930946704?text=Ol%C3%A1!%20Vim%20atrav%C3%A9s%20do%20seu%20portf%C3%B3lio."
      target="_blank"
      rel="noopener noreferrer"
      className="whatsapp-btn"
      aria-label="WhatsApp"
    >
      <WhatsAppIcon size={30} />
    </a>
  );
};

export default WhatsAppButton;