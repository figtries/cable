export default function PageWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div className="animate-fade-up px-8 py-8">
      {children}
    </div>
  )
}
