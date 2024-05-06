import React from 'react';
import { RoomProvider } from './RoomContext';
import { BillProvider } from './BillContext';
import { StatusDocProvider } from './StatusDocsContext';
import { StoreTypesProvider } from './StoreTypesContext';
import { Marc21Provider } from '../helper/HandleMarc21Data';

function ProviderContext({children}) {
    return (
        <Marc21Provider>
        <RoomProvider>
        <BillProvider>
        <StatusDocProvider>
        <StoreTypesProvider>
            {children}
        </StoreTypesProvider>
        </StatusDocProvider>
        </BillProvider>
        </RoomProvider>
        </Marc21Provider>
    )
};

export default ProviderContext;