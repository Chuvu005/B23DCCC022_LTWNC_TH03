export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <div style={{ padding: '8px 12px', marginBottom: '16px', background: '#f1f5f9', borderRadius: '4px', fontSize: '14px', color: '#475569' }}>
        Khu vực thành viên
      </div>
      {children}
    </div>
  );
}
