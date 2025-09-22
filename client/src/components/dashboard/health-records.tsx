import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery } from "@tanstack/react-query";
import { getAuthHeaders } from "@/lib/auth";
import { 
  FileText, 
  Download, 
  Eye, 
  Upload, 
  Search,
  Calendar,
  User,
  Activity,
  FileImage
} from "lucide-react";
import type { HealthRecord } from "@/types/health";

export default function HealthRecords() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("overview");

  const { data: allRecords, isLoading } = useQuery({
    queryKey: ["/api/health/records"],
    queryFn: async () => {
      const response = await fetch("/api/health/records", {
        headers: getAuthHeaders(),
      });
      if (!response.ok) throw new Error("Failed to fetch health records");
      return response.json() as Promise<HealthRecord[]>;
    },
  });

  const { data: profile } = useQuery({
    queryKey: ["/api/migrant/profile"],
    queryFn: async () => {
      const response = await fetch("/api/migrant/profile", {
        headers: getAuthHeaders(),
      });
      if (!response.ok) throw new Error("Failed to fetch profile");
      return response.json();
    },
  });

  const filteredRecords = allRecords?.filter(record => 
    record.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    record.description?.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  const getRecordsByType = (type: string) => 
    filteredRecords.filter(record => record.recordType === type);

  const visits = getRecordsByType("visit");
  const immunizations = getRecordsByType("immunization");
  const labs = getRecordsByType("lab");
  const documents = getRecordsByType("document");

  if (isLoading) {
    return (
      <Card className="kerala-card mb-8">
        <CardContent className="p-6">
          <div className="animate-pulse">
            <div className="h-6 bg-muted rounded mb-4 w-48"></div>
            <div className="h-10 bg-muted rounded mb-6"></div>
            <div className="h-32 bg-muted rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const lastVisit = visits[0];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <Card className="kerala-card mb-8" data-testid="health-records">
        <CardContent className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold text-foreground">Health Records</h3>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search records..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-64"
                data-testid="input-search-records"
              />
            </div>
          </div>
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-5 bg-muted p-1 rounded-lg mb-6">
              <TabsTrigger 
                value="overview" 
                className="data-[state=active]:bg-background data-[state=active]:text-foreground"
                data-testid="tab-overview"
              >
                Overview
              </TabsTrigger>
              <TabsTrigger 
                value="visits" 
                className="data-[state=active]:bg-background data-[state=active]:text-foreground"
                data-testid="tab-visits"
              >
                Visits
              </TabsTrigger>
              <TabsTrigger 
                value="immunizations" 
                className="data-[state=active]:bg-background data-[state=active]:text-foreground"
                data-testid="tab-immunizations"
              >
                Immunizations
              </TabsTrigger>
              <TabsTrigger 
                value="labs" 
                className="data-[state=active]:bg-background data-[state=active]:text-foreground"
                data-testid="tab-labs"
              >
                Labs
              </TabsTrigger>
              <TabsTrigger 
                value="documents" 
                className="data-[state=active]:bg-background data-[state=active]:text-foreground"
                data-testid="tab-documents"
              >
                Documents
              </TabsTrigger>
            </TabsList>

            <AnimatePresence mode="wait">
              <TabsContent value="overview" className="mt-0">
                <motion.div
                  key="overview"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="grid md:grid-cols-2 gap-6"
                >
                  <div className="bg-muted/50 rounded-lg p-4">
                    <h4 className="font-medium text-foreground mb-2">Last Visit</h4>
                    {lastVisit ? (
                      <div className="text-sm text-muted-foreground space-y-1">
                        <div>Date: {new Date(lastVisit.date).toLocaleDateString()}</div>
                        <div>Doctor: {lastVisit.doctorName || "Not specified"}</div>
                        <div>Facility: {lastVisit.facilityName || "Not specified"}</div>
                        <div>Condition: {lastVisit.title}</div>
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">No visits recorded</p>
                    )}
                  </div>
                  <div className="bg-muted/50 rounded-lg p-4">
                    <h4 className="font-medium text-foreground mb-2">Key Health Metrics</h4>
                    <div className="text-sm text-muted-foreground space-y-1">
                      <div>Blood Group: {profile?.bloodGroup || "Not specified"}</div>
                      <div>Age: {profile?.age || "Not specified"}</div>
                      <div>Gender: {profile?.gender || "Not specified"}</div>
                      <div>Total Records: {allRecords?.length || 0}</div>
                    </div>
                  </div>
                </motion.div>
              </TabsContent>

              <TabsContent value="visits" className="mt-0">
                <motion.div
                  key="visits"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  {visits.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-border">
                            <th className="text-left py-2 text-muted-foreground">Date</th>
                            <th className="text-left py-2 text-muted-foreground">Doctor</th>
                            <th className="text-left py-2 text-muted-foreground">Diagnosis</th>
                            <th className="text-left py-2 text-muted-foreground">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {visits.map((visit) => (
                            <tr key={visit.id} className="border-b border-border">
                              <td className="py-2">{new Date(visit.date).toLocaleDateString()}</td>
                              <td className="py-2">{visit.doctorName || "Not specified"}</td>
                              <td className="py-2">{visit.title}</td>
                              <td className="py-2">
                                <Button 
                                  size="sm" 
                                  variant="ghost" 
                                  className="text-primary hover:text-primary/80"
                                  data-testid={`button-view-visit-${visit.id}`}
                                >
                                  <FileText className="h-4 w-4 mr-1" />
                                  View
                                </Button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">No visit records found</p>
                    </div>
                  )}
                </motion.div>
              </TabsContent>

              <TabsContent value="immunizations" className="mt-0">
                <motion.div
                  key="immunizations"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  {immunizations.length > 0 ? (
                    <div className="space-y-4">
                      {immunizations.map((immunization) => (
                        <div 
                          key={immunization.id} 
                          className="flex items-center justify-between p-3 border border-border rounded-lg"
                          data-testid={`immunization-${immunization.id}`}
                        >
                          <div className="flex items-center">
                            <Activity className="h-5 w-5 text-green-500 mr-3" />
                            <div>
                              <div className="font-medium">{immunization.title}</div>
                              <div className="text-sm text-muted-foreground">
                                {new Date(immunization.date).toLocaleDateString()}
                              </div>
                            </div>
                          </div>
                          <Button size="sm" variant="ghost" className="text-primary hover:text-primary/80">
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <Activity className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">No immunization records found</p>
                    </div>
                  )}
                </motion.div>
              </TabsContent>

              <TabsContent value="labs" className="mt-0">
                <motion.div
                  key="labs"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  {labs.length > 0 ? (
                    <div className="space-y-4">
                      {labs.map((lab) => (
                        <div 
                          key={lab.id} 
                          className="flex items-center justify-between p-3 border border-border rounded-lg"
                          data-testid={`lab-${lab.id}`}
                        >
                          <div>
                            <div className="font-medium">{lab.title}</div>
                            <div className="text-sm text-muted-foreground">
                              {new Date(lab.date).toLocaleDateString()}
                            </div>
                          </div>
                          <Button 
                            size="sm" 
                            className="bg-primary text-primary-foreground hover:bg-primary/90"
                            data-testid={`button-download-lab-${lab.id}`}
                          >
                            <Download className="h-4 w-4 mr-1" />
                            Download
                          </Button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <FileImage className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">No lab reports found</p>
                    </div>
                  )}
                </motion.div>
              </TabsContent>

              <TabsContent value="documents" className="mt-0">
                <motion.div
                  key="documents"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-4"
                >
                  {documents.length > 0 && (
                    <div className="space-y-4 mb-6">
                      {documents.map((document) => (
                        <div 
                          key={document.id} 
                          className="flex items-center justify-between p-3 border border-border rounded-lg"
                          data-testid={`document-${document.id}`}
                        >
                          <div>
                            <div className="font-medium">{document.title}</div>
                            <div className="text-sm text-muted-foreground">
                              Uploaded: {new Date(document.date).toLocaleDateString()}
                            </div>
                          </div>
                          <Button size="sm" variant="ghost" className="text-primary hover:text-primary/80">
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                    <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                    <div className="text-muted-foreground mb-2">Upload new document</div>
                    <Button 
                      variant="secondary" 
                      size="sm"
                      data-testid="button-upload-document"
                    >
                      Choose File
                    </Button>
                  </div>
                </motion.div>
              </TabsContent>
            </AnimatePresence>
          </Tabs>
        </CardContent>
      </Card>
    </motion.div>
  );
}
