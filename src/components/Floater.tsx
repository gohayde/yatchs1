import { Phone } from 'lucide-react';

export default function Floater() {
  const handleWhatsapp = () => {
    // Standard direct link trigger for whatsapp inquiries
    window.open('https://wa.me/971509955700?text=Hello%20Yachts1,%20I%2520am%2520interested%2520in%2520booking%2520a%2520yacht%2520viewing.', '_blank');
  };

  const handlePhone = () => {
    window.location.href = 'tel:+971509955700';
  };

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col gap-3">
      {/* Phone float icon */}
      <button
        onClick={handlePhone}
        className="w-12 h-12 bg-brand-blue text-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 active:scale-95 transition-all duration-300 pointer-events-auto cursor-pointer"
        aria-label="Call Yachts1 Client Support"
      >
        <Phone className="w-5 h-5" />
      </button>

      {/* Whatsapp float icon */}
      <button
        onClick={handleWhatsapp}
        className="w-12 h-12 bg-[#25D366] text-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 active:scale-95 transition-all duration-300 pointer-events-auto cursor-pointer"
        aria-label="Chat on WhatsApp"
      >
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
          <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.513 2.262 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.457L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.725 1.45 5.535 0 10.04-4.501 10.043-10.04 0-2.684-1.044-5.207-2.943-7.105C16.516 1.56 13.99 .517 11.3 1.519M6.59 19.154" />
          <path d="M12.004 2.01c-5.51 0-9.993 4.483-9.997 9.994-.001 1.914.5 3.775 1.454 5.425l-.955 3.486 3.568-.936c1.586.865 3.36 1.321 5.176 1.322H11.3c2.454 0 4.761-.955 6.495-2.69 1.734-1.734 2.69-4.041 2.69-6.495 0-5.512-4.487-9.996-9.992-9.996zm5.415 13.435c-.22.617-1.285 1.201-1.77 1.248-.445.044-.92.052-1.545-.145a8.216 8.216 0 0 1-3.351-2.112c-1.116-1.116-1.874-2.433-2.083-2.784-.21-.351-.013-.541.162-.718l.453-.453c.12-.12.18-.179.255-.32a.456.456 0 0 0-.022-.444c-.053-.105-.453-1.089-.62-1.49-.162-.397-.33-.351-.453-.351h-.385c-.135 0-.352.053-.532.22-.18.18-.705.69-.705 1.684 0 .991.72 1.952.822 2.083.1.135 2.1 3.205 5.087 4.5l.848.33c.712.225 1.358.195 1.868.12.568-.083 1.748-.713 1.996-1.402.247-.69.247-1.283.172-1.402-.075-.12-.277-.18-.57-.33z" />
        </svg>
      </button>
    </div>
  );
}
