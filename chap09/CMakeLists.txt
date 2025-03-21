cmake_minimum_required(VERSION 3.28)
project(chap09 C)

set(CMAKE_C_STANDARD 23)

add_executable(signalHandler
        textbook-gists/SignalHandler/signal_handler.c
        textbook-gists/signal-handler-driver.c
)
