type CardProps = {
    children: React.ReactNode;
    onClick?: () => void;
    className?: string;
  };
  
  export default function Card({ children, onClick, className= '' }: CardProps) {
    return (
      <div
        onClick={onClick}
        className={`rounded cursor-pointer p-3 m-6 min-h-10 min-w-20 text-center shadow-lg hover:shadow-2xl hover:translate-x-1 hover:-translate-y-1 ${className}`}
      >
        {children}
      </div>
    );
  }
  