cmake_minimum_required(VERSION 3.28)
project(chap08 C)

set(CMAKE_C_STANDARD 23)
#find_package(OpenMP REQUIRED)
find_package(Threads REQUIRED)      ## pthreads


####################
## VECTOR MAXIMUM ##
####################

add_executable(vectorMaximumSequential
        textbook-gists/VectorMaximum/vector_maximum.c
        textbook-gists/vector-maximum-driver.c
        textbook-gists/print-arrays.c
        textbook-gists/print-arrays.h
)

add_executable(vectorMaximumParallel
        textbook-gists/VectorMaximum/vector_maximum_openmp.c
        textbook-gists/vector-maximum-driver.c
        textbook-gists/print-arrays.c
        textbook-gists/print-arrays.h
)

#target_link_libraries(vectorMaximumParallel PRIVATE OpenMP::OpenMP_C)
target_link_libraries(vectorMaximumParallel PRIVATE -fopenmp)
target_compile_options(vectorMaximumParallel PRIVATE
        $<$<CXX_COMPILER_ID:GNU>:-fopenmp>
        $<$<CXX_COMPILER_ID:Clang>:-fopenmp>
)

add_executable(vectorMaximumParallelWithSIMD
        textbook-gists/VectorMaximum/vector_maximum_openmp_simd.c
        textbook-gists/vector-maximum-driver.c
        textbook-gists/print-arrays.c
        textbook-gists/print-arrays.h
)

#target_link_libraries(vectorMaximumParallelWithSIMD PRIVATE OpenMP::OpenMP_C)
target_link_libraries(vectorMaximumParallelWithSIMD PRIVATE -fopenmp)
target_compile_options(vectorMaximumParallelWithSIMD PRIVATE
        $<$<CXX_COMPILER_ID:GNU>:-fopenmp -ftree-vectorize -O3>
        $<$<CXX_COMPILER_ID:Clang>:-fopenmp -ftree-vectorize -O3>
)


##############
# MERGE SORT #
##############

add_executable(mergeSortSequential
        textbook-gists/MergeSort/merge_sort.c
        textbook-gists/mergesort-driver.c
        textbook-gists/print-arrays.c
        textbook-gists/print-arrays.h
)

add_executable(mergeSortParallel
        textbook-gists/MergeSort/merge_sort_openmp.c
        textbook-gists/mergesort-driver.c
        textbook-gists/print-arrays.c
        textbook-gists/print-arrays.h
)

#target_link_libraries(mergeSortParallel PRIVATE OpenMP::OpenMP_C)
target_link_libraries(mergeSortParallel PRIVATE -fopenmp)
target_compile_options(mergeSortParallel PRIVATE
        $<$<CXX_COMPILER_ID:GNU>:-fopenmp>
        $<$<CXX_COMPILER_ID:Clang>:-fopenmp>
)

add_executable(mergeSortParallelWithSIMD
        textbook-gists/MergeSort/merge_sort_openmp_simd.c
        textbook-gists/mergesort-driver.c
        textbook-gists/print-arrays.c
        textbook-gists/print-arrays.h
)

#target_link_libraries(mergeSortParallelWithSIMD PRIVATE OpenMP::OpenMP_C)
target_link_libraries(mergeSortParallelWithSIMD PRIVATE -fopenmp)
target_compile_options(mergeSortParallelWithSIMD PRIVATE
        $<$<CXX_COMPILER_ID:GNU>:-fopenmp -ftree-vectorize -O3>
        $<$<CXX_COMPILER_ID:Clang>:-fopenmp -ftree-vectorize -O3>
)


#########################
# PROCESSES AND THREADS #
#########################

add_executable(processDemonstrations
        textbook-gists/ForkAndWait/fork_demo.c
        textbook-gists/ForkAndWait/wait_demo.c
        textbook-gists/ForkAndWait/waitpid_demo.c
        textbook-gists/Pipe/pipe_demo.c
        textbook-gists/processes-driver.c
        textbook-gists/menu.c
        textbook-gists/menu.h
)

add_executable(pthreadDemonstrations
        textbook-gists/PthreadCreateAndJoin/thread_demo.c
        textbook-gists/PthreadSharedMemory/shared_memory_demo.c
        textbook-gists/pthreads-driver.c
        textbook-gists/menu.c
        textbook-gists/menu.h
)

target_link_libraries(pthreadDemonstrations PRIVATE Threads::Threads)


#############################
# PROBLEMS WITH CONCURRENCY #
#############################

add_executable(interleavings
        textbook-gists/Interleavings/sequential_code.c
        textbook-gists/Interleavings/unsynchronized_code.c
        textbook-gists/Interleavings/mutex_code.c
        textbook-gists/Interleavings/atomic_code.c
        textbook-gists/interleavings-driver.c
        textbook-gists/menu.c
        textbook-gists/menu.h
)

target_link_libraries(interleavings PRIVATE Threads::Threads)

add_executable(diningPhilosophers
        textbook-gists/DiningPhilosophers/dining-philosophers.h
        textbook-gists/DiningPhilosophers/maitre-d.c
        textbook-gists/DiningPhilosophers/basic-philosopher.c
        textbook-gists/DiningPhilosophers/polite-philosopher.c
        textbook-gists/DiningPhilosophers/starving-philosopher.c
        textbook-gists/dining-philosophers-driver.c
        textbook-gists/menu.c
        textbook-gists/menu.h
)

target_link_libraries(diningPhilosophers PRIVATE Threads::Threads)
