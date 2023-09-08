interface Props {
  className?: string;
  children: any;
}

const AttributeContainer = ({ className, children }: Props) => {
  return (
    <div
      className={`flex flex-col gap-1
    ${className}`}
    >
      {children}
    </div>
  );
};

export default AttributeContainer;
