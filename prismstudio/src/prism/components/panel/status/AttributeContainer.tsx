interface Props {
  className?: string;
  children: any;
}

const AttributeContainer = ({ className, children }: Props) => {
  return (
    <div
      className={`flex flex-col
    ${className}`}
    >
      {children}
    </div>
  );
};

export default AttributeContainer;
