const AttributeTitle = ({ children }: React.HTMLAttributes<unknown>) => {
  return (
    <div
      className="text-white w-full text-lg
        flex flex-col justify-center
       border-l-4 border-l-white
       px-2
       h-7
       bg-[#00ADB5]
       "
    >
      <span className="align-sub text-white text-sm">{children}</span>
    </div>
  );
};

export default AttributeTitle;
