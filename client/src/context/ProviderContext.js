import React from 'react';
import { RoomProvider } from './RoomContext';
import { BillProvider } from './BillContext';
import { StatusDocProvider } from './StatusDocsContext';
import { StoreTypesProvider } from './StoreTypesContext';

function ProviderContext({children}) {
    return (
        <RoomProvider>
        <BillProvider>
        <StatusDocProvider>
        <StoreTypesProvider>
            {children}
        </StoreTypesProvider>
        </StatusDocProvider>
        </BillProvider>
        </RoomProvider>
    )
};

export default ProviderContext;