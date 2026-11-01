#include "closest_pair.hpp"

#include <algorithm>
#include <cmath>
#include <stdexcept>

namespace {

double euclideanDistance(const DeliveryPoint& first, const DeliveryPoint& second) {
    return std::hypot(first.x - second.x, first.y - second.y);
}

bool precedesByX(const DeliveryPoint& first, const DeliveryPoint& second) {
    if (first.x != second.x) return first.x < second.x;
    if (first.y != second.y) return first.y < second.y;
    return first.id < second.id;
}

bool precedesByY(const DeliveryPoint& first, const DeliveryPoint& second) {
    if (first.y != second.y) return first.y < second.y;
    if (first.x != second.x) return first.x < second.x;
    return first.id < second.id;
}

ClosestPairResult makeResult(const DeliveryPoint& first, const DeliveryPoint& second) {
    return ClosestPairResult{first, second, euclideanDistance(first, second)};
}

ClosestPairResult bruteForceClosestPair(const std::vector<DeliveryPoint>& pointsByX,
                                        std::size_t begin, std::size_t end) {
    ClosestPairResult best = makeResult(pointsByX[begin], pointsByX[begin + 1]);
    for (std::size_t i = begin; i < end; ++i) {
        for (std::size_t j = i + 1; j < end; ++j) {
            const double candidateDistance = euclideanDistance(pointsByX[i], pointsByX[j]);
            if (candidateDistance < best.distance) {
                best = ClosestPairResult{pointsByX[i], pointsByX[j], candidateDistance};
            }
        }
    }
    return best;
}

ClosestPairResult closestPairRecursive(const std::vector<DeliveryPoint>& pointsByX,
                                       std::size_t begin, std::size_t end,
                                       std::vector<DeliveryPoint> pointsByY) {
    const std::size_t count = end - begin;
    if (count <= 3) {
        return bruteForceClosestPair(pointsByX, begin, end);
    }

    const std::size_t middle = begin + count / 2;
    const DeliveryPoint& dividingPoint = pointsByX[middle];

    std::vector<DeliveryPoint> leftByY;
    std::vector<DeliveryPoint> rightByY;
    leftByY.reserve(middle - begin);
    rightByY.reserve(end - middle);

    for (const DeliveryPoint& point : pointsByY) {
        if (precedesByX(point, dividingPoint)) {
            leftByY.push_back(point);
        } else {
            rightByY.push_back(point);
        }
    }

    ClosestPairResult leftBest = closestPairRecursive(pointsByX, begin, middle, std::move(leftByY));
    ClosestPairResult rightBest = closestPairRecursive(pointsByX, middle, end, std::move(rightByY));
    ClosestPairResult best = leftBest.distance <= rightBest.distance ? leftBest : rightBest;

    std::vector<DeliveryPoint> strip;
    for (const DeliveryPoint& point : pointsByY) {
        if (std::fabs(point.x - dividingPoint.x) < best.distance) {
            strip.push_back(point);
        }
    }

    for (std::size_t i = 0; i < strip.size(); ++i) {
        for (std::size_t j = i + 1; j < strip.size() && j <= i + 7 &&
                                    strip[j].y - strip[i].y < best.distance;
             ++j) {
            const double candidateDistance = euclideanDistance(strip[i], strip[j]);
            if (candidateDistance < best.distance) {
                best = ClosestPairResult{strip[i], strip[j], candidateDistance};
            }
        }
    }
    return best;
}

}

void ClosestPairFinder::addPoint(const std::string& id, double x, double y) {
    if (id.empty()) {
        throw std::invalid_argument("Point id must not be empty");
    }
    if (!std::isfinite(x) || !std::isfinite(y)) {
        throw std::invalid_argument("Point coordinates must be finite");
    }
    if (!registeredIds.insert(id).second) {
        throw std::invalid_argument("Duplicate point id: " + id);
    }
    points.push_back(DeliveryPoint{id, x, y});
}

void ClosestPairFinder::clearPoints() {
    points.clear();
    registeredIds.clear();
}

const std::vector<DeliveryPoint>& ClosestPairFinder::getPoints() const {
    return points;
}

ClosestPairResult ClosestPairFinder::findClosestPair() const {
    if (points.size() < 2) {
        throw std::invalid_argument("At least two points are required");
    }

    std::vector<DeliveryPoint> pointsByX = points;
    std::sort(pointsByX.begin(), pointsByX.end(), precedesByX);

    std::vector<DeliveryPoint> pointsByY = points;
    std::sort(pointsByY.begin(), pointsByY.end(), precedesByY);

    return closestPairRecursive(pointsByX, 0, pointsByX.size(), std::move(pointsByY));
}
