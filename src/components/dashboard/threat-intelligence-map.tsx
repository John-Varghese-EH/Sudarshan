'use client';

import React, { useState, useEffect } from 'react';
import { ComposableMap, Geographies, Geography, Marker, Line } from 'react-simple-maps';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Globe } from 'lucide-react';
import MAP_DATA from '@/lib/map-data';

const GEO_URL = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";
const SOURCE_OF_THREATS = [-30, 30] as [number, number];

const ThreatIntelligenceMap = () => {
  const [threats, setThreats] = useState<any[]>([]);

  useEffect(() => {
    const generateThreats = () => {
      const newThreats = MAP_DATA.map(country => ({
        ...country,
        threatLevel: Math.random() * 100,
        type: Math.random() > 0.5 ? 'Malware' : 'Phishing',
      }));
      setThreats(newThreats);
    };

    generateThreats();
    const interval = setInterval(generateThreats, 5000);

    return () => clearInterval(interval);
  }, []);

  const getThreatColor = (level: number) => {
    if (level > 75) return 'hsl(var(--destructive))';
    if (level > 40) return 'hsl(var(--warning))';
    return 'hsl(var(--primary))';
  };

  return (
    <Card className="w-full h-full flex flex-col bg-card/60 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center"><Globe className="mr-2" /> Threat Intelligence Map</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow p-0 min-h-0">
        <div className="w-full h-full rounded-lg overflow-hidden relative">
          <ComposableMap 
            projectionConfig={{ scale: 180, rotation: [-11, 0, 0] }}
            className="w-full h-full"
          >
            <Geographies geography={GEO_URL}>
              {({ geographies }) =>
                geographies.map(geo => (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    fill="hsl(var(--foreground)/0.1)"
                    stroke="hsl(var(--foreground)/0.15)"
                    style={{
                      default: { outline: 'none' },
                      hover: { outline: 'none', fill: 'hsl(var(--primary)/0.4)' },
                      pressed: { outline: 'none' },
                    }}
                  />
                ))
              }
            </Geographies>
            <TooltipProvider>
              {threats.map(threat => (
                <React.Fragment key={threat.name}>
                  <Line
                    from={SOURCE_OF_THREATS}
                    to={threat.coordinates as [number, number]}
                    stroke={getThreatColor(threat.threatLevel)}
                    strokeWidth={1.5}
                    strokeDasharray="5 5"
                  />
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Marker coordinates={threat.coordinates as [number, number]}>
                        <g className="cursor-pointer transition-transform duration-300 hover:scale-125">
                          <circle r={12} fill={getThreatColor(threat.threatLevel)} fillOpacity={0.2} />
                          <circle r={6} fill={getThreatColor(threat.threatLevel)} fillOpacity={0.6}/>
                          <circle r={3} fill={getThreatColor(threat.threatLevel)} />
                          <animate
                            attributeName="r"
                            from="3"
                            to="12"
                            dur="1.5s"
                            begin="0s"
                            repeatCount="indefinite"
                            keySplines=".17,.67,.83,.67"
                            values="3; 12; 3"
                          />
                          <animate
                            attributeName="opacity"
                            from="1"
                            to="0"
                            dur="1.5s"
                            begin="0s"
                            repeatCount="indefinite"
                            values="1; 0; 1"
                          />
                        </g>
                      </Marker>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="font-bold">{threat.name}</p>
                      <p>Type: {threat.type}</p>
                      <p>Level: {threat.threatLevel.toFixed(0)}</p>
                    </TooltipContent>
                  </Tooltip>
                </React.Fragment>
              ))}
            </TooltipProvider>
          </ComposableMap>
        </div>
      </CardContent>
    </Card>
  );
};

export default ThreatIntelligenceMap;
