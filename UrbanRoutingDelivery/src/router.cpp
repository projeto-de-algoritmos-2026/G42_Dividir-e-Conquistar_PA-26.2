#include "router.hpp"

#include <iomanip>
#include <limits>
#include <sstream>
#include <utility>
#include <vector>

namespace {

const std::vector<std::pair<std::string, std::pair<double, double>>> defaultDFPoints = {
    {"Centro de Distribuicao", {44.0, 47.0}},
    {"Asa Sul", {53.0, 59.0}},
    {"Taguatinga", {25.0, 65.0}},
    {"Samambaia", {20.0, 89.0}},
    {"Ceilandia", {13.0, 74.0}},
    {"Sudoeste", {34.0, 51.0}},
    {"Asa Norte", {51.0, 35.0}},
    {"Lago Norte", {63.0, 25.0}},
    {"Lago Sul", {67.0, 67.0}},
    {"Jardim Botanico", {78.0, 80.0}},
    {"Sobradinho", {57.0, 9.0}},
    {"Deposito Isolado", {87.0, 13.0}}
};

std::string escapeJsonString(const std::string& value) {
    std::ostringstream stream;
    for (char character : value) {
        switch (character) {
            case '"':
                stream << "\\\"";
                break;
            case '\\':
                stream << "\\\\";
                break;
            case '\b':
                stream << "\\b";
                break;
            case '\f':
                stream << "\\f";
                break;
            case '\n':
                stream << "\\n";
                break;
            case '\r':
                stream << "\\r";
                break;
            case '\t':
                stream << "\\t";
                break;
            default:
                if (static_cast<unsigned char>(character) < 0x20) {
                    stream << "\\u" << std::hex << std::setw(4) << std::setfill('0')
                           << static_cast<int>(static_cast<unsigned char>(character))
                           << std::dec << std::setfill(' ');
                } else {
                    stream << character;
                }
                break;
        }
    }
    return stream.str();
}

std::string formatNumber(double value) {
    std::ostringstream stream;
    stream << std::setprecision(10) << value;
    return stream.str();
}

std::string buildErrorJson(const std::string& message) {
    return "{\"status\": \"error\", \"message\": \"" + escapeJsonString(message) + "\"}";
}

std::string serializeTasks(const std::vector<DeliveryTask>& tasks) {
    std::ostringstream stream;
    stream << "[";
    for (std::size_t index = 0; index < tasks.size(); ++index) {
        if (index > 0) {
            stream << ", ";
        }
        const DeliveryTask& task = tasks[index];
        stream << "{\"id\": \"" << escapeJsonString(task.id)
               << "\", \"destination\": \"" << escapeJsonString(task.destination)
               << "\", \"startTime\": " << task.startTime
               << ", \"endTime\": " << task.endTime << "}";
    }
    stream << "]";
    return stream.str();
}

}

Router::Router(int maxLocations)
    : maxLocations(maxLocations), nextId(0), graph(maxLocations) {}

int Router::registerLocation(const std::string& name) {
    auto existing = nameToId.find(name);
    if (existing != nameToId.end()) {
        return existing->second;
    }

    if (nextId >= maxLocations) {
        throw std::out_of_range("Location capacity exceeded");
    }

    int assignedId = nextId++;
    nameToId.emplace(name, assignedId);
    idToName.emplace(assignedId, name);
    return assignedId;
}

bool Router::addLocation(const std::string& name) {
    if (nameToId.find(name) != nameToId.end()) {
        return false;
    }
    registerLocation(name);
    return true;
}

void Router::addRoute(const std::string& source, const std::string& target, double distance) {
    int sourceId = registerLocation(source);
    int targetId = registerLocation(target);
    graph.addUndirectedEdge(sourceId, targetId, distance);
}

std::string Router::getShortestPathJson(const std::string& source, const std::string& target) {
    auto sourceEntry = nameToId.find(source);
    if (sourceEntry == nameToId.end()) {
        return buildErrorJson("Source location not found: " + source);
    }

    auto targetEntry = nameToId.find(target);
    if (targetEntry == nameToId.end()) {
        return buildErrorJson("Target location not found: " + target);
    }

    PathResult result;
    try {
        result = graph.calculateShortestPath(sourceEntry->second, targetEntry->second);
    } catch (const std::exception& error) {
        return buildErrorJson(error.what());
    }

    if (result.path.empty() || result.totalCost == std::numeric_limits<double>::infinity()) {
        return buildErrorJson("No route available between " + source + " and " + target);
    }

    std::ostringstream stream;
    stream << "{\"status\": \"success\", \"path\": [";
    for (std::size_t index = 0; index < result.path.size(); ++index) {
        if (index > 0) {
            stream << ", ";
        }
        stream << "\"" << escapeJsonString(idToName.at(result.path[index])) << "\"";
    }
    stream << "], \"distance\": " << formatNumber(result.totalCost) << "}";
    return stream.str();
}

void Router::addDeliveryTask(const std::string& id, const std::string& destination, int startTime, int endTime) {
    scheduler.addTask(id, destination, startTime, endTime);
}

std::string Router::getOptimalScheduleJson() {
    try {
        ScheduleResult result = scheduler.calculateOptimalSchedule();

        std::ostringstream stream;
        stream << "{\"status\": \"success\", \"total_scheduled\": " << result.totalScheduled
               << ", \"scheduled\": " << serializeTasks(result.selectedTasks)
               << ", \"rejected\": " << serializeTasks(result.rejectedTasks) << "}";
        return stream.str();
    } catch (const std::exception& error) {
        return buildErrorJson(error.what());
    }
}

std::string Router::getClosestPairJson(const std::vector<std::pair<std::string, std::pair<double, double>>>& customPoints) {
    try {
        closestPairFinder.clearPoints();

        const auto& pointsToUse = customPoints.empty() ? defaultDFPoints : customPoints;

        for (const auto& pt : pointsToUse) {
            closestPairFinder.addPoint(pt.first, pt.second.first, pt.second.second);
        }

        ClosestPairResult result = closestPairFinder.findClosestPair();

        std::ostringstream stream;
        stream << "{\"status\": \"success\", \"pointA\": {\"id\": \"" << escapeJsonString(result.pointA.id)
               << "\", \"x\": " << formatNumber(result.pointA.x) << ", \"y\": " << formatNumber(result.pointA.y)
               << "}, \"pointB\": {\"id\": \"" << escapeJsonString(result.pointB.id)
               << "\", \"x\": " << formatNumber(result.pointB.x) << ", \"y\": " << formatNumber(result.pointB.y)
               << "}, \"distance\": " << formatNumber(result.distance) << "}";
        return stream.str();
    } catch (const std::invalid_argument& error) {
        return buildErrorJson(error.what());
    }
}