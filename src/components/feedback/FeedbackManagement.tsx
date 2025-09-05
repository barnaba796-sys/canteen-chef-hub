import { useState } from "react";
import { MessageSquare, Star, ThumbsUp, ThumbsDown, Reply, Filter, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const mockFeedback = [
  {
    id: 1,
    customerName: "John Doe",
    customerEmail: "john@example.com",
    rating: 5,
    comment: "Excellent food quality and quick service. The chicken biryani was amazing!",
    date: "2024-01-15",
    status: "new",
    orderItems: ["Chicken Biryani", "Raita"],
    response: null
  },
  {
    id: 2,
    customerName: "Jane Smith",
    customerEmail: "jane@example.com",
    rating: 4,
    comment: "Good food but the waiting time was a bit long. Overall satisfied with the experience.",
    date: "2024-01-14",
    status: "responded",
    orderItems: ["Dal Tadka", "Naan", "Jeera Rice"],
    response: "Thank you for your feedback! We're working on reducing wait times."
  },
  {
    id: 3,
    customerName: "Bob Wilson",
    customerEmail: "bob@example.com", 
    rating: 2,
    comment: "The food was cold when served and the taste was not up to the mark. Please improve.",
    date: "2024-01-13",
    status: "pending",
    orderItems: ["Paneer Curry", "Roti"],
    response: null
  }
];

const ratingStats = [
  { stars: 5, count: 45, percentage: 60 },
  { stars: 4, count: 20, percentage: 27 },
  { stars: 3, count: 8, percentage: 11 },
  { stars: 2, count: 2, percentage: 2 },
  { stars: 1, count: 0, percentage: 0 }
];

export const FeedbackManagement = () => {
  const [feedback, setFeedback] = useState(mockFeedback);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRating, setFilterRating] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [replyingTo, setReplyingTo] = useState<number | null>(null);
  const [replyText, setReplyText] = useState("");

  const filteredFeedback = feedback.filter(item => {
    const matchesSearch = item.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.comment.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRating = filterRating === "all" || item.rating.toString() === filterRating;
    const matchesStatus = filterStatus === "all" || item.status === filterStatus;
    return matchesSearch && matchesRating && matchesStatus;
  });

  const averageRating = feedback.reduce((sum, item) => sum + item.rating, 0) / feedback.length;
  const totalFeedback = feedback.length;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "new": return "bg-blue-100 text-blue-800";
      case "responded": return "bg-green-100 text-green-800";
      case "pending": return "bg-orange-100 text-orange-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getRatingColor = (rating: number) => {
    if (rating >= 4) return "text-green-600";
    if (rating >= 3) return "text-yellow-600";
    return "text-red-600";
  };

  const handleReply = (id: number) => {
    // Handle reply submission
    setFeedback(prev => prev.map(item => 
      item.id === id 
        ? { ...item, response: replyText, status: "responded" }
        : item
    ));
    setReplyingTo(null);
    setReplyText("");
  };

  const StarRating = ({ rating }: { rating: number }) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 ${
              star <= rating 
                ? "fill-yellow-400 text-yellow-400" 
                : "text-gray-300"
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Feedback & Reviews</h1>
          <p className="text-muted-foreground">Monitor customer satisfaction and respond to reviews</p>
        </div>
      </div>

      {/* Feedback Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Star className="h-5 w-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Average Rating</p>
                <p className="text-xl font-bold">{averageRating.toFixed(1)}/5</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <MessageSquare className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Feedback</p>
                <p className="text-xl font-bold">{totalFeedback}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 bg-green-100 rounded-lg flex items-center justify-center">
                <ThumbsUp className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Positive Reviews</p>
                <p className="text-xl font-bold">{feedback.filter(f => f.rating >= 4).length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 bg-red-100 rounded-lg flex items-center justify-center">
                <ThumbsDown className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Needs Attention</p>
                <p className="text-xl font-bold">{feedback.filter(f => f.rating <= 2).length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Rating Distribution */}
      <Card>
        <CardHeader>
          <CardTitle>Rating Distribution</CardTitle>
          <CardDescription>Breakdown of customer ratings</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {ratingStats.map((stat) => (
              <div key={stat.stars} className="flex items-center gap-4">
                <div className="flex items-center gap-2 w-20">
                  <span className="text-sm font-medium">{stat.stars}</span>
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                </div>
                <div className="flex-1">
                  <div className="w-full bg-secondary h-2 rounded-full">
                    <div 
                      className="h-2 bg-yellow-400 rounded-full transition-all duration-500"
                      style={{ width: `${stat.percentage}%` }}
                    />
                  </div>
                </div>
                <div className="text-sm text-muted-foreground w-16 text-right">
                  {stat.count} ({stat.percentage}%)
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Input
          placeholder="Search feedback..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="sm:max-w-sm"
        />
        <Select value={filterRating} onValueChange={setFilterRating}>
          <SelectTrigger className="sm:w-48">
            <SelectValue placeholder="Filter by rating" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Ratings</SelectItem>
            <SelectItem value="5">5 Stars</SelectItem>
            <SelectItem value="4">4 Stars</SelectItem>
            <SelectItem value="3">3 Stars</SelectItem>
            <SelectItem value="2">2 Stars</SelectItem>
            <SelectItem value="1">1 Star</SelectItem>
          </SelectContent>
        </Select>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="sm:w-48">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="new">New</SelectItem>
            <SelectItem value="responded">Responded</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Feedback List */}
      <div className="space-y-4">
        {filteredFeedback.map((item) => (
          <Card key={item.id} className="hover:shadow-card transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <Avatar>
                    <AvatarImage src="" />
                    <AvatarFallback>{item.customerName.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold">{item.customerName}</h4>
                      <StarRating rating={item.rating} />
                      <span className={`font-medium ${getRatingColor(item.rating)}`}>
                        {item.rating}/5
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">{item.customerEmail}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(item.date).toLocaleDateString('en-IN')} •
                      Ordered: {item.orderItems.join(", ")}
                    </p>
                  </div>
                </div>
                <Badge className={getStatusColor(item.status)}>
                  {item.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-foreground">{item.comment}</p>
                
                {item.response && (
                  <div className="bg-accent/50 p-3 rounded-lg border-l-4 border-primary">
                    <div className="flex items-center gap-2 mb-2">
                      <Reply className="h-4 w-4 text-primary" />
                      <span className="text-sm font-medium text-primary">Your Response</span>
                    </div>
                    <p className="text-sm">{item.response}</p>
                  </div>
                )}
                
                {!item.response && (
                  <>
                    {replyingTo === item.id ? (
                      <div className="space-y-3">
                        <Textarea
                          placeholder="Write your response..."
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                          className="min-h-20"
                        />
                        <div className="flex gap-2">
                          <Button 
                            size="sm" 
                            onClick={() => handleReply(item.id)}
                            disabled={!replyText.trim()}
                          >
                            Send Reply
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => {
                              setReplyingTo(null);
                              setReplyText("");
                            }}
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="gap-2"
                        onClick={() => setReplyingTo(item.id)}
                      >
                        <Reply className="h-4 w-4" />
                        Reply to Customer
                      </Button>
                    )}
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredFeedback.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No feedback found</h3>
            <p className="text-muted-foreground">
              {searchTerm || filterRating !== "all" || filterStatus !== "all"
                ? "Try adjusting your search or filter criteria"
                : "No customer feedback has been received yet"}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};