const Card = ({ title, value }) => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-amber-200 
                    hover:shadow-2xl hover:scale-[1.02] transition-all duration-300">
      <h2 className="text-sm font-medium text-gray-500 tracking-wide">{title}</h2>
      <p className="text-3xl font-extrabold text-amber-700 mt-2">
        {value}
      </p>
    </div>
  );
};

export default Card;
