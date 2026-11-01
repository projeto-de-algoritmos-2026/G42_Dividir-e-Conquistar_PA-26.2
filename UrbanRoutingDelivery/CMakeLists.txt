cmake_minimum_required(VERSION 3.10)
project(UrbanRoutingDelivery)

if(CMAKE_CXX_COMPILER_ID MATCHES "GNU|Clang")
    add_compile_options(-Wall -Wextra -Wpedantic)
endif()

set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

add_executable(urban_router
    src/main.cpp
    src/router.cpp
    src/graphs/graph.cpp
    src/greedy/scheduler.cpp
    src/divide_and_conquer/closest_pair.cpp
)

target_include_directories(urban_router PRIVATE
    src
    src/graphs
    src/greedy
    src/divide_and_conquer
)