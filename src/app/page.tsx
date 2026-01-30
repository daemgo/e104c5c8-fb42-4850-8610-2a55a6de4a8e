import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <h1 className="text-5xl md:text-6xl font-serif font-medium tracking-wide">
            欢迎使用 SyncMind
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground font-light">
            AI 驱动的企业客户数字化档案管理系统
          </p>
          <div className="flex items-center justify-center gap-4 pt-4">
            <Link href="/customers">
              <Button size="lg">查看客户档案</Button>
            </Link>
            <Button size="lg" variant="outline" asChild>
              <a
                href="https://docs.anthropic.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                了解更多
              </a>
            </Button>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid gap-6 md:grid-cols-3">
          <Card>
            <CardHeader>
              <div className="text-4xl mb-2">🎯</div>
              <CardTitle>深度企业洞察</CardTitle>
              <CardDescription>
                基于工商信息、政策信号、行业痛点等多维度数据分析
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <div className="text-4xl mb-2">🚀</div>
              <CardTitle>销售进攻指南</CardTitle>
              <CardDescription>
                破冰话术、竞对分析、访谈提纲，助力面客准备
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <div className="text-4xl mb-2">📊</div>
              <CardTitle>可视化档案</CardTitle>
              <CardDescription>
                结构化数据展示，方便浏览和管理所有客户信息
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>

      {/* Quick Actions Section */}
      <div className="container mx-auto px-4 py-16">
        <h2 className="text-2xl font-serif font-medium text-center mb-8">
          快速开始
        </h2>
        <div className="max-w-2xl mx-auto space-y-4">
          <Card
            className="hover:shadow-md transition-shadow cursor-pointer"
            asChild
          >
            <Link href="/customers">
              <CardContent className="flex items-center justify-between p-6">
                <div>
                  <h3 className="font-medium mb-1">浏览客户档案</h3>
                  <p className="text-sm text-muted-foreground">
                    查看和管理所有客户的数字化档案
                  </p>
                </div>
                <span className="text-muted-foreground">→</span>
              </CardContent>
            </Link>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <h3 className="font-medium mb-1">创建新客户档案</h3>
              <p className="text-sm text-muted-foreground mb-4">
                使用{" "}
                <code className="bg-muted px-2 py-1 rounded text-xs">
                  /profile
                </code>{" "}
                skill 创建新的客户档案
              </p>
              <div className="bg-muted/50 rounded-lg p-4 text-sm space-y-2">
                <div className="font-medium">支持分析维度：</div>
                <ul className="space-y-1 text-muted-foreground">
                  <li>• 工商信息深度解读（企查查/天眼查）</li>
                  <li>• 政策敏感度分析（专精特新、数字化转型）</li>
                  <li>• 10+ 行业痛点库匹配</li>
                  <li>• 时机判断（融资、扩张、转型、危机）</li>
                  <li>• 信用/风险信号检查</li>
                  <li>• 组织架构与决策链条推断</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
