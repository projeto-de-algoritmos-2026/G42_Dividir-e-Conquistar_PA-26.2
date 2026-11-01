#pragma once

#include <string>
#include <unordered_set>
#include <vector>

struct DeliveryPoint {
    std::string id;
    double x = 0.0;
    double y = 0.0;
};

struct ClosestPairResult {
    DeliveryPoint pointA;
    DeliveryPoint pointB;
    double distance = 0.0;
};

class ClosestPairFinder {
public:
    void addPoint(const std::string& id, double x, double y);
    void clearPoints();
    const std::vector<DeliveryPoint>& getPoints() const;
    ClosestPairResult findClosestPair() const;

private:
    std::vector<DeliveryPoint> points;
    std::unordered_set<std::string> registeredIds;
};
