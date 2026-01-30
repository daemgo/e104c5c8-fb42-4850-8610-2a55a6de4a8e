import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import fs from "fs";
import path from "path";
import Link from "next/link";

interface CustomerIndexEntry {
  id: string;
  companyName: string;
  shortName: string;
  industry: string;
  scale: string;
  rating: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

interface CustomerIndex {
  customers: CustomerIndexEntry[];
  updatedAt: string;
}

function getCustomerIndex(): CustomerIndex {
  const indexPath = path.join(process.cwd(), "docs", "customers", "index.json");
  if (!fs.existsSync(indexPath)) {
    return { customers: [], updatedAt: new Date().toISOString() };
  }
  try {
    const data = fs.readFileSync(indexPath, "utf-8");
    return JSON.parse(data);
  } catch {
    return { customers: [], updatedAt: new Date().toISOString() };
  }
}

function getStatusVariant(
  status: string,
): "default" | "secondary" | "destructive" | "outline" {
  switch (status) {
    case "已签约":
      return "default";
    case "跟进中":
      return "secondary";
    case "潜在客户":
      return "outline";
    case "已关闭":
      return "destructive";
    default:
      return "outline";
  }
}

function getRatingColor(rating: string): string {
  const ratingValue = rating.replace(/[^A-]/g, "");
  if (ratingValue.startsWith("A")) return "text-green-600 dark:text-green-400";
  if (ratingValue.startsWith("B"))
    return "text-yellow-600 dark:text-yellow-400";
  return "text-red-600 dark:text-red-400";
}

export default function CustomersPage() {
  const index = getCustomerIndex();
  const { customers } = index;

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-serif font-medium tracking-wide">
                客户档案
              </h1>
              <p className="text-muted-foreground mt-1">
                管理和查看所有客户的数字化档案
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Input placeholder="搜索客户..." className="w-64" />
              <Button>新建客户</Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {customers.length === 0 ? (
          <Card className="p-12">
            <CardContent className="flex flex-col items-center justify-center text-center space-y-4">
              <div className="text-muted-foreground text-6xl">📁</div>
              <h3 className="text-xl font-medium">暂无客户档案</h3>
              <p className="text-muted-foreground max-w-md">
                使用{" "}
                <code className="bg-muted px-2 py-1 rounded text-sm">
                  /profile
                </code>{" "}
                skill 创建第一个客户档案
              </p>
              <Button className="mt-4">创建第一个客户</Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {customers.map((customer) => (
              <Card
                key={customer.id}
                className="group hover:shadow-md transition-shadow cursor-pointer"
              >
                <CardHeader>
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-lg truncate">
                        {customer.shortName}
                      </CardTitle>
                      <CardDescription className="truncate mt-1">
                        {customer.companyName}
                      </CardDescription>
                    </div>
                    <Badge variant={getStatusVariant(customer.status)}>
                      {customer.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">行业</span>
                      <span>{customer.industry}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">规模</span>
                      <span>{customer.scale}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">评级</span>
                      <span
                        className={`font-medium ${getRatingColor(customer.rating)}`}
                      >
                        {customer.rating}
                      </span>
                    </div>
                  </div>
                  <Separator />
                  <div className="text-xs text-muted-foreground space-y-1">
                    <div className="flex justify-between">
                      <span>创建于</span>
                      <span>
                        {new Date(customer.createdAt).toLocaleDateString(
                          "zh-CN",
                        )}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>更新于</span>
                      <span>
                        {new Date(customer.updatedAt).toLocaleDateString(
                          "zh-CN",
                        )}
                      </span>
                    </div>
                  </div>
                  <Button variant="outline" className="w-full" asChild>
                    <Link href={`/customers/${customer.id}`}>查看详情 →</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
