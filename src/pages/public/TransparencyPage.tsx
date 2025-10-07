import React, { useState, useMemo } from 'react';
import { FileText } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Input } from '../../components/ui/Input';
import KPIStatCard from '../../components/transparency/KPIStatCard';
import MonthlyBarChartMock from '../../components/transparency/MonthlyBarChartMock';
import ExpensesTable, { ExpenseItem } from '../../components/transparency/ExpensesTable';
import PublicNav from '../../components/layout/PublicNav';

const TransparencyPage: React.FC = () => {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProject, setSelectedProject] = useState<string | null>(null);

  // Mock transparency reports (would come from API later)
  const transparencyReports = [
    {
      id: '1',
      projectName: 'Clean Water Initiative',
      type: 'distribution',
      totalBudget: 50000,
      collected: 42000,
      spent: 35000,
      beneficiaries: 1250,
      progress: 70,
      lastUpdate: '2024-12-15',
      documents: ['Budget Report Q4', 'Distribution Log', 'Impact Assessment'],
      milestones: [
        { name: 'Water Source Identification', status: 'completed', date: '2024-10-01' },
        { name: 'Infrastructure Setup', status: 'in-progress', date: '2024-12-20' },
        { name: 'Community Training', status: 'pending', date: '2025-02-01' }
      ],
      monthly: [
        { month: 'Aug', planned: 8000, collected: 7500, spent: 6800 },
        { month: 'Sep', planned: 9000, collected: 8600, spent: 7900 },
        { month: 'Oct', planned: 10000, collected: 9500, spent: 8300 },
        { month: 'Nov', planned: 12000, collected: 10800, spent: 9500 },
        { month: 'Dec', planned: 11000, collected: 9600, spent: 8500 }
      ],
      expenses: [
        { id: 'e1', date: '2024-10-04', category: 'Logistics', description: 'Transport pipes to site', amount: 1200 },
        { id: 'e2', date: '2024-10-10', category: 'Materials', description: 'Water filtration units', amount: 3400 },
        { id: 'e3', date: '2024-11-02', category: 'Personnel', description: 'Field engineer fees', amount: 2200 },
        { id: 'e4', date: '2024-11-15', category: 'Training', description: 'Community hygiene workshop', amount: 900 },
        { id: 'e5', date: '2024-12-01', category: 'Maintenance', description: 'Pump preventive maintenance', amount: 650 },
      ] as ExpenseItem[]
    },
    {
      id: '2',
      projectName: 'Digital Literacy Program',
      type: 'formation',
      totalBudget: 30000,
      collected: 26000,
      spent: 22500,
      beneficiaries: 850,
      progress: 85,
      lastUpdate: '2024-12-10',
      documents: ['Training Report', 'Curriculum Overview', 'Student Progress'],
      milestones: [
        { name: 'Curriculum Development', status: 'completed', date: '2024-09-15' },
        { name: 'Trainer Certification', status: 'completed', date: '2024-11-01' },
        { name: 'Final Assessment', status: 'in-progress', date: '2024-12-30' }
      ],
      monthly: [
        { month: 'Aug', planned: 5000, collected: 5200, spent: 4800 },
        { month: 'Sep', planned: 6000, collected: 5800, spent: 5400 },
        { month: 'Oct', planned: 6500, collected: 6300, spent: 6000 },
        { month: 'Nov', planned: 7000, collected: 6800, spent: 6200 },
        { month: 'Dec', planned: 6500, collected: 4900, spent: 4100 }
      ],
      expenses: [
        { id: 'e6', date: '2024-10-05', category: 'Personnel', description: 'Trainer daily fees', amount: 1500 },
        { id: 'e7', date: '2024-10-21', category: 'Materials', description: 'Learning tablets', amount: 5000 },
        { id: 'e8', date: '2024-11-03', category: 'Logistics', description: 'Venue rental', amount: 800 },
        { id: 'e9', date: '2024-11-18', category: 'Training', description: 'Workshop supplies', amount: 450 },
        { id: 'e10', date: '2024-12-04', category: 'Connectivity', description: 'Internet data bundles', amount: 300 },
      ] as ExpenseItem[]
    }
  ];

  const filteredReports = transparencyReports.filter(report =>
    report.projectName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const aggregate = useMemo(() => {
    const totals = filteredReports.reduce((acc, r) => {
      acc.planned += r.totalBudget;
      acc.collected += r.collected;
      acc.spent += r.spent;
      acc.beneficiaries += r.beneficiaries;
      return acc;
    }, { planned: 0, collected: 0, spent: 0, beneficiaries: 0 });
    return {
      ...totals,
      gap: Math.max(totals.planned - totals.collected, 0)
    };
  }, [filteredReports]);

  return (
    <div className="min-h-screen bg-background text-text-primary">
      <PublicNav />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4">
            {t('transparency.title')}
          </h1>
          <p className="text-text-secondary text-lg max-w-3xl">
            {t('transparency.subtitle')}
          </p>
        </div>

        {/* Global KPI Bar */}
        <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4 mb-10">
          <KPIStatCard label={t('transparency.kpis.planned')} value={`$${aggregate.planned.toLocaleString()}`} accent="neutral" />
          <KPIStatCard label={t('transparency.kpis.collected')} value={`$${aggregate.collected.toLocaleString()}`} accent="success" />
          <KPIStatCard label={t('transparency.kpis.spent')} value={`$${aggregate.spent.toLocaleString()}`} accent="warning" />
          <KPIStatCard label={t('transparency.kpis.gap')} value={`$${aggregate.gap.toLocaleString()}`} accent="error" />
          <KPIStatCard label={t('transparency.kpis.beneficiaries')} value={aggregate.beneficiaries} accent="primary" />
        </div>

        {/* Search & Filters */}
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center">
          <div className="flex-1">
            <Input
              placeholder={t('common.search') || 'Search...'}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button variant="outline" size="sm">{t('transparencyExtras.filterByType','Filter by Type')}</Button>
          <Button variant="outline" size="sm">{t('transparencyExtras.filterByStatus','Filter by Status')}</Button>
        </div>

        {/* Projects */}
        <div className="space-y-6">
          {filteredReports.map((report) => {
            const fundingGap = Math.max(report.totalBudget - report.collected, 0);
            const categories = Array.from(new Set(report.expenses.map(e => e.category)));
            return (
              <Card key={report.id} className="shadow-sm">
                <CardHeader>
                  <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                    <div>
                      <CardTitle className="text-xl">{report.projectName}</CardTitle>
                      <div className="flex flex-wrap items-center gap-2 mt-2 text-xs">
                        <Badge variant={report.type === 'distribution' ? 'primary' : 'success'}>
                          {report.type}
                        </Badge>
                        <span className="text-text-secondary">
                          {t('common.progress')}: {report.progress}% • {t('transparency.kpis.beneficiaries')}: {report.beneficiaries}
                        </span>
                        <span className="text-text-tertiary">
                          {new Date(report.lastUpdate).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant={selectedProject === report.id ? 'primary' : 'outline'}
                        onClick={() => setSelectedProject(selectedProject === report.id ? null : report.id)}
                        size="sm"
                      >
                        {selectedProject === report.id ? t('transparency.hideDetails') : t('transparency.viewDetails')}
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {/* Per-project KPI mini row */}
                  <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3 mb-6">
                    <KPIStatCard label={t('transparency.kpis.planned')} value={`$${report.totalBudget.toLocaleString()}`} />
                    <KPIStatCard label={t('transparency.kpis.collected')} value={`$${report.collected.toLocaleString()}`} accent="success" />
                    <KPIStatCard label={t('transparency.kpis.spent')} value={`$${report.spent.toLocaleString()}`} accent="warning" />
                    <KPIStatCard label={t('transparency.kpis.gap')} value={`$${fundingGap.toLocaleString()}`} accent={fundingGap === 0 ? 'success' : 'error'} />
                    <KPIStatCard label={t('transparency.kpis.beneficiaries')} value={report.beneficiaries} accent="primary" />
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-6">
                    <div className="flex justify-between text-sm text-text-secondary mb-1">
                      <span>{t('transparency.projectProgress')}</span>
                      <span>{report.progress}%</span>
                    </div>
                    <div className="w-full bg-background-light rounded-full h-2">
                      <div className="bg-primary h-2 rounded-full transition-all duration-300" style={{ width: `${report.progress}%` }} />
                    </div>
                  </div>

                  {/* Expanded details */}
                  {selectedProject === report.id && (
                    <div className="space-y-10">
                      {/* Chart & Breakdown */}
                      <div className="grid md:grid-cols-2 gap-8">
                        <div>
                          <h4 className="font-semibold mb-3 text-sm tracking-wide uppercase text-text-secondary">{t('transparency.chart.monthlyOverview')}</h4>
                          <MonthlyBarChartMock data={report.monthly} />
                        </div>
                        <div>
                          <h4 className="font-semibold mb-3 text-sm tracking-wide uppercase text-text-secondary">{t('transparency.financialBreakdown')}</h4>
                          <div className="bg-background-light p-4 rounded-lg space-y-3">
                            <div className="flex justify-between text-sm">
                              <span className="text-text-secondary">{t('transparency.kpis.collected')}</span>
                              <span className="font-medium">${report.collected.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-text-secondary">{t('transparency.kpis.spent')}</span>
                              <span className="font-medium text-warning">${report.spent.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-text-secondary">{t('transparency.remaining')}</span>
                              <span className="font-medium">${(report.totalBudget - report.spent).toLocaleString()}</span>
                            </div>
                            <div className="pt-2">
                              <div className="flex justify-between text-xs text-text-secondary mb-1">
                                <span>{t('transparency.budgetUtilization')}</span>
                                <span>{((report.spent / report.totalBudget) * 100).toFixed(1)}%</span>
                              </div>
                              <div className="w-full bg-background rounded-full h-2">
                                <div className="bg-warning h-2 rounded-full" style={{ width: `${(report.spent / report.totalBudget) * 100}%` }} />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Expenses */}
                      <div>
                        <h4 className="font-semibold mb-4 text-sm tracking-wide uppercase text-text-secondary">{t('transparency.expenses.title')}</h4>
                        <ExpensesTable items={report.expenses} categories={categories} />
                      </div>

                      {/* Milestones & Documents */}
                      <div className="grid md:grid-cols-2 gap-8">
                        <div>
                          <h4 className="font-semibold mb-3 text-sm tracking-wide uppercase text-text-secondary">{t('transparency.milestones')}</h4>
                          <div className="space-y-3">
                            {report.milestones.map((milestone, index) => (
                              <div key={index} className="flex items-center space-x-3">
                                <div className={`w-3 h-3 rounded-full ${
                                  milestone.status === 'completed' ? 'bg-success' :
                                  milestone.status === 'in-progress' ? 'bg-warning' : 'bg-border'
                                }`} />
                                <div className="flex-1 min-w-0">
                                  <div className="font-medium text-text-primary text-sm">{milestone.name}</div>
                                  <div className="text-text-tertiary text-xs">
                                    {new Date(milestone.date).toLocaleDateString()}
                                  </div>
                                </div>
                                <Badge 
                                  variant={
                                    milestone.status === 'completed' ? 'success' :
                                    milestone.status === 'in-progress' ? 'warning' : 'secondary'
                                  }
                                  size="sm"
                                >
                                  {milestone.status}
                                </Badge>
                              </div>
                            ))}
                          </div>
                        </div>
                        <div>
                          <h4 className="font-semibold mb-3 text-sm tracking-wide uppercase text-text-secondary">{t('transparency.documents')}</h4>
                          <div className="space-y-2">
                            {report.documents.map((doc, index) => (
                              <div key={index} className="flex items-center justify-between p-3 bg-background-light rounded-lg text-sm">
                                <div className="flex items-center space-x-2">
                                  <FileText size={16} className="text-primary" />
                                  <span className="text-text-primary">{doc}</span>
                                </div>
                                <Button size="sm" variant="outline">{t('transparencyExtras.downloadAnnual','Download Annual Report')}</Button>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Call to Action */}
        <div className="mt-16 text-center">
          <Card className="max-w-2xl mx-auto">
            <CardContent className="py-8">
              <h3 className="text-xl font-bold mb-4">
                {t('transparencyExtras.questions','Questions about our transparency?')}
              </h3>
              <p className="text-text-secondary mb-6 text-sm md:text-base">
                {t('transparencyExtras.promise',"We're committed to full transparency. Contact us for detailed financial reports or project updates.")}
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-3">
                <Button>{t('transparencyExtras.contactUs','Contact Us')}</Button>
                <Button variant="outline">{t('transparencyExtras.downloadAnnual','Download Annual Report')}</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default TransparencyPage;
