//export const CaretIcon = ({ className = "" }) => {
export default function CaretIcon({ className = "" }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 16 16"
      fill="currentColor"
      className={`inline-block ${className}`}
    >
      <path d="M6 14C5.71875 14 5.46875 13.9063 5.28125 13.7188C4.875 13.3438 4.875 12.6875 5.28125 12.3125L9.5625 8L5.28125 3.71875C4.875 3.34375 4.875 2.6875 5.28125 2.3125C5.65625 1.90625 6.3125 1.90625 6.6875 2.3125L11.6875 7.3125C12.0938 7.6875 12.0938 8.34375 11.6875 8.71875L6.6875 13.7188C6.5 13.9063 6.25 14 6 14Z" />
    </svg>
  );
};
