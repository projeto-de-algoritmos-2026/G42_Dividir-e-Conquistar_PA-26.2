#pragma once

#include "closest_pair.hpp"
#include "graph.hpp"
#include "greedy/scheduler.hpp"

#include <string>
#include <unordered_map>
#include <utility>
#include <vector>

class Router {
public:
    explicit Router(int maxLocations);

    bool addLocation(const std::string& name);
    void addRoute(const std::string& source, const std::string& target, double distance);

    std::string getShortestPathJson(const std::string& source, const std::string& target);

    void addDeliveryTask(const std::string& id, const std::string& destination, int startTime, int endTime);
    std::string getOptimalScheduleJson();

    std::string getClosestPairJson(const std::vector<std::pair<std::string, std::pair<double, double>>>& customPoints = {});

private:
    int registerLocation(const std::string& name);

    int maxLocations;
    int nextId;
    std::unordered_map<std::string, int> nameToId;
    std::unordered_map<int, std::string> idToName;
    Graph graph;
    DeliveryScheduler scheduler;
    ClosestPairFinder closestPairFinder;
};