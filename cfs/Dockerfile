FROM ubuntu:18.04

RUN apt-get -y update && apt-get -y install build-essential 
RUN apt-get install -y git cmake gcc
            
WORKDIR /cFS
RUN cd /cFS
RUN git clone https://github.com/nasa/cFS.git ./

RUN git submodule init \
    && git submodule update \
    && cp cfe/cmake/Makefile.sample Makefile \
    && cp -r cfe/cmake/sample_defs .

RUN make prep
RUN make
RUN make install
