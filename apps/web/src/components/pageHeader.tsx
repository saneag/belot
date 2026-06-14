interface PageHeaderProps {
  title: string;
}

export const PageHeader = ({ title }: PageHeaderProps) => {
  return <h1 className="absolute top-5 text-4xl font-normal">{title}</h1>;
};
